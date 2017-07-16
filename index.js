'use strict';

const diffChars = require('diff').diffChars;
const cli = require('heroku-cli-util');

const red = cli.color.red;
const green = cli.color.green;
const yellow = cli.color.yellow;
const appColor = cli.color.app;
const releaseColor = cli.color.release;

function keysDiff(obj1, obj2) {
    const added = [];
    const removed = [];
    const modified = [];
    Object.keys(obj1)
        .forEach(k => {
            if (!obj2.hasOwnProperty(k)) {
                removed.push(k);
            } else {
                if (obj1[k] !== obj2[k]) {
                    modified.push(k);
                }
            }
        });
    Object.keys(obj2)
        .forEach(k => {
            if (!obj1.hasOwnProperty(k)) {
                added.push(k);
            }
        });
    return { added, removed, modified };
}

function colorCharsDiff(diff) {
    return diff.map(part => {
        if (part.added) {
            return cli.color.green(part.value);
        } else if (part.removed) {
            return cli.color.red(part.value);
        } 
        return part.value;

    }).join('');
}

function diffCommand(context, heroku) {
    const getReleaseConfig = (release) => 
        heroku.get(`/apps/${context.app}/releases/${release}/config-vars`);
    const releaseFrom = context.args['release_from'];
    const releaseTo = context.args['release_to'];
    Promise.all([getReleaseConfig(releaseFrom), getReleaseConfig(releaseTo)])
        .then(([configFrom, configTo]) => {
            cli.log(`Configuration difference for app ${appColor(context.app)} between ${releaseColor(releaseFrom)} and ${releaseColor(releaseTo)}`);
            const diff = keysDiff(configFrom, configTo);
            diff.added.forEach(k => {
                cli.log(green(`+ ${k}="${configTo[k]}"`));
            });
            diff.modified.forEach(k => {
                const charsDiff = diffChars(configFrom[k], configTo[k]);
                cli.log(`${yellow('±')} ${cli.color.yellow(k)}="${colorCharsDiff(charsDiff)}"`)
            });
            diff.removed.forEach(k => {
                cli.log(red(`- ${k}="${configFrom[k]}"`));
            });
        });
}

exports.commands = [
{
    topic: 'releases',
    command: 'diff',
    description: 'Diffs two releases of given application',
    variableArgs: false,
    args: [{name: 'release_from'}, {name: 'release_to'}],
    needsApp: true,
    needsAuth: true,
    run: cli.command(diffCommand)
}
];
