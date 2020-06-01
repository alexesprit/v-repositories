'use strict';

const { Octokit } = require('@octokit/rest');

const octokit = new Octokit();

async function getAllRepositories() {
    const perPage = 100;
    let pageNumber = 1;
    let entries = [];

    while (true) {
        const { data } = await octokit.search.repos({
            q: 'language:V', sort: 'stars', order: 'desc',
            per_page: perPage, page: pageNumber
        });
        const { total_count, items } = data;

        entries.push(...items);

        if (total_count - pageNumber * perPage <= 0) {
            break;
        }

        ++pageNumber;
    }

    return entries;
}

async function main() {
    const entries = await getAllRepositories();
    
    const sorted = entries.sort((a, b) => {
        return b.updated_at.localeCompare(a.updated_at);
    });

    for (const entry of sorted) {
        const { html_url, full_name, updated_at } = entry;
        let license = 'no license';

        if (entry.license) {
            license = entry.license.key;
            // continue;
        }

        console.log(`${full_name} :: ${license}`);
        console.log(`${html_url}`);
        console.log(`Updated at ${updated_at}`);
        console.log('');
    }

    return 0;
}

main();