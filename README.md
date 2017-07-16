# Heroku CLI releases:diff

The diff utility to check for configuration changes between releases of given heroku app

## Installation

```
heroku plugins:install heroku-cli-releases-diff
```

## Usage

```
heroku releases:diff <versionFrom> <versionTo>
```

## Example 

```
$ heroku releases:diff -a plan3-sample-app1 v9 v12
Configuration difference for app ⬢ plan3-sample-app1 between v9 and v12
+ Y="c"
+ Z="d"
± X="ab"
- W="xyz"
```

 * green `+` denotes added entries
 * yellow `±` denotes modified entries
 * red `-` denotes removed entries

