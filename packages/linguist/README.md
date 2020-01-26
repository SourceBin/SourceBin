# linguist

Small package that turns `github/linguist` [languages.yml](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml) into a JSON format that can easily be used.

## Structure

`linguist.json`

```json
{
  "183": {
    "name": "JavaScript",
    "aliases": [
      "js",
      "node"
    ],
    "aceMode": "javascript"
  }
}
```

`languages.json`

```json
{
  "JavaScript": 183
}
```
