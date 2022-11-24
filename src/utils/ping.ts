const ping = async (domain: string) => {
    const data = await fetch("https://" + domain).then(() => true).catch(() => false);

    return data
}

export default ping;