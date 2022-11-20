import chalk from "chalk";

const prefix = "[SegfaultAPI] ";

const log = (msg: string, type?: string) => {

	switch (type) {
		case "error":
            throwError(msg);
            break;
		case "warning":
			process.emitWarning(chalk.yellow(prefix) + msg);
            break;
		default:
			console.log(chalk.green(prefix) + msg);
	}
};

const throwError = (msg: string) => {
    console.error(chalk.red(prefix) + msg);
    process.exit(1);
}

export default log;
