const dotenv = require('dotenv').config({
    path: "pw.env"
});
const colors = require('colors');
const Snoolicious = require('./lib/Snoolicious');
const snoolicious = new Snoolicious();

let count = 0;
async function handleSubmission(task) {
    const saved = await snoolicious.requester.getSubmission(task.item.id).saved;
    // console.log("was already saved: ", saved);
    if (!saved) {
        const cssClass = task.item.author_flair_css_class;
        if (task.item.author_flair_text === 'LEVEL ME UP!') {
            console.log(`NEW USER "${task.item.author.name}" LEVLING UP!`);
            await snoolicious.requester
                .getUser(task.item.author.name)
                .assignFlair({
                    subredditName: process.env.MASTER_SUB,
                    text: 'LEVEL 1',
                    cssClass
                });
        } else if (task.item.author_flair_text.startsWith('LEVEL ')) {
            console.log(`USER "${task.item.author.name}" LEVLING UP!`);
            const currentLevel =
                task.item.author_flair_text.substring(6, task.item.author_flair_text.length);
            const nextLevel = parseInt(currentLevel) + 1;
            const nextLevelFlairString = `LEVEL ${nextLevel}`;
            await snoolicious.requester
                .getUser(task.item.author.name)
                .assignFlair({
                    subredditName: process.env.MASTER_SUB,
                    text: nextLevelFlairString,
                    cssClass
                });
        }
        await snoolicious.requester.getSubmission(task.item.id).save();
    }
}

/* [Snoolicious Run Cycle] */
const INTERVAL = (process.env.INTERVAL * 1000);
console.log("S * N * O * O * L * I * C * I * O * U * S".random)
async function run() {
        console.log("I am awake!");
        await snoolicious.getSubmissions(3);
        await snoolicious.queryTasks(null, handleSubmission);
        console.log(`Finished Quereying Tasks. Sleeping for ${INTERVAL/1000} seconds...`.rainbow);
        setTimeout(async () => {
            await run()
        }, (INTERVAL));
    }
    (async () => {
        await run();
    })();