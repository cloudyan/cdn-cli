import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import pkg from '../package.json';

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000,
});

function updateCheck() {
  if (notifier.update) {
    console.log(`New version available: ${chalk.cyan(notifier.update.latest)}, it's recommended that you update before using.`);
    notifier.notify();
  } else {
    console.log(`No new version is available.`);
  }
}

export default updateCheck;
