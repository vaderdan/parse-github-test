# parse github
### test parsing github with xpath

methods:

Parseservice

getUser

getUserRepos


getUserRepoFiles

returns:

```json

{
  "files": [
    "http://github.com/vaderdan/dominspector/blob/master/LICENSE",
    "http://github.com/vaderdan/dominspector/blob/master/README",
    "http://github.com/vaderdan/dominspector/blob/master/README.md",
    "http://github.com/vaderdan/dominspector/blob/master/manifest.json",
    "http://github.com/vaderdan/dominspector/tree/master/_locales",
    "http://github.com/vaderdan/dominspector/tree/master/css",
    "http://github.com/vaderdan/dominspector/tree/master/icons",
    "http://github.com/vaderdan/dominspector/tree/master/img",
    "http://github.com/vaderdan/dominspector/tree/master/lib",
    "http://github.com/vaderdan/dominspector/tree/master/src"
  ],
  "dirs": [],
  "url": "http://github.com/vaderdan/dominspector/file-list/master"
}
```




request:

http://localhost:1337/parse/repostree?user=vaderdan&repo=dominspector


