const webdavUrl = wt_webdavurl;
const basicAuth = btoa(`${wt_user}:${wt_password}`);

const taskName = "WuWaTracker";
const debugFilePath = `Tasker/${taskName}/debug.log`;
const errorFilePath = `Tasker/${taskName}/error.log`;

const DEBUG = global("%WtDebug") === "0" ? 0 : 1

const toast = content => { flashLong(`${taskName}: ${content}`) };
const _print = (filePath, content) => {
    const time = new Date().toLocaleString("zh-Hans-CN")
    writeFile(filePath, `${time}: ${content}\n`, true)
}
const printDebug = (content) => {
    if (!DEBUG) return
    _print(debugFilePath, content)
}
const printError = (content) => {
    toast(`Task run failed, check error log at ${errorFilePath}.`)
    _print(errorFilePath, content)
}
const handleFinish = () => {
    setGlobal("%WtGameLaunched", 1)
}

(async () => {
    printDebug(`${taskName} task start...`)
    printDebug("Checking if the file exists.")
    const existRes = await fetch(webdavUrl, {
        method: "HEAD",
        headers: {
            Authorization: `Basic ${basicAuth}`
        }
    })

    if (!existRes.ok) {
        printDebug("File do not exist, haven't launch WuWa today, notify and exit...")
        exit()
    }

    printDebug("File exist, reading file content.")
    const recordRes = await fetch(webdavUrl, {
        method: "GET",
        headers: {
            Authorization: `Basic ${basicAuth}`
        }
    })
    if (!recordRes.ok) {
        printDebug("Read file failed, print error message and exit...")
        printError("Response headers:\n" + recordRes.headers)
        exit()
    }

    const recordsText = await recordRes.text()
    const records = recordsText.split("\n")
    if (records.every(record => record === "")) {
        printDebug("Haven't launch WuWa today, notify and exit...")
        exit()
    }
    const lastLaunch = new Date(records.findLast(ele => ele !== ""))
    printDebug("Last launch time: " + lastLaunch.toLocaleString("zh-Hans-CN"))

    const now = new Date()
    printDebug("Now: " + now.toLocaleString("zh-Hans-CN"))
    const today4AM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        4
    )

    if (lastLaunch < today4AM) {
        printDebug(`Haven't launch WuWa today, notify and exit...`)
    } else {
        handleFinish()
        printDebug("Good, you have played WuWa today, exit...")
    }

    exit()
})().catch(err => {
    printDebug("Something error happend, exit...")
    printError(err)
    exit()
})
