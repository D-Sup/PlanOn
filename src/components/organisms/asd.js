const today = new Date();
const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000) * 94);
const randomHour = Math.floor(Math.random() * (24 - 20) + 20);
const randomMinute = Math.floor(Math.random() * 60);
const randomSecond = Math.floor(Math.random() * 60);
const dayTo = `${today.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} ${randomHour}:${randomMinute}:${randomSecond} KST`;
const dayYesterday = `${yesterday.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} ${randomHour}:${randomMinute}:${randomSecond} KST`;
console.log("# today");
console.log(`git commit --amend --no-edit --date "${dayTo}"`);
console.log(`GIT_COMMITTER_DATE="${dayTo}" git commit --amend --no-edit`);
console.log("# yesterday");
console.log(`git commit --amend --no-edit --date "${dayYesterday}"`); // 첫번쨰 명령어
console.log(`GIT_COMMITTER_DATE="${dayYesterday}" git commit --amend --no-edit`); // 두번째명령어
console.log("git push -f"); // 강제 푸시