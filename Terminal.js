const url = require('url');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const localKeysPath = "./local_keys.json"

class Terminal
{
    // baseURL;
    // qs
    // id;
    // key;
    // extra_bit;
    // hashed_code;

    constructor(local_config_file = localKeysPath)
    {
        var file_content = JSON.parse(fs.readFileSync(local_config_file, 'utf-8'))

        this.baseURL = url.format({
            pathname: path.join("/localhost", "file_access_tests", "terminal_access.php"),
            protocol: 'http'
        });

        this.id = file_content.terminal_id;
        this.key = file_content.key;

        if (!this.id || !this.key)
            console.log("Missing local config values");
        // console.log(this);
    }

    
    async ask_for_code(force_retry = false)
    {
        if (this.extra_bit && !force_retry)
            return this;
        console.log("Fetch started!");
        const url = "http://" + path.join("localhost", "file_access_tests", "terminal_access.php");
        
        var res = await fetch(url + "?" + "terminal_id="+this.id)
        await res.text()
        .then(data => {
            try
            {
                this.extra_bit = JSON.parse(data).key_extra;
            }
            catch
            {
                this.extra_bit = "";
                console.log("Bad request: " + data);
            }
            console.log("###received confirmation bit: " + this.extra_bit);
        })
        console.log("Fetch done!");
        return this;
    }

    async create_hashed_code()
    {
        if (this.hashed_code)
            return this.hashed_code;
        if (!this.key)
        {
            console.log("Missing code creation requirements");
            return null;
        }
        if (!this.extra_bit)
            await this.ask_for_code();
        // return (this.hashed_code = this.key + this.extra_bit);
        return (this.hashed_code = crypto.createHash("sha256").update(String(this.key + this.extra_bit)).digest("hex"));
    }

    async create_qs()
    {
        if (this.qs)
            return this.qs;
        if (!this.hashed_code)
            await this.create_hashed_code();
        this.qs = (new URLSearchParams({terminal_id: this.id, key: this.hashed_code})).toString();
        console.log(this.qs);
        return this.qs;
    }
}

module.exports = Terminal;