export const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatForStatus = (data: any[]) => {
    if (!data.length) return [];

    return data.map((item) => {
        return {
            name: item.title,
            domain: item.domain,
            url: item.url,
            time_limit: item.limit,
            status: capitalizeFirstLetter(item.status),
            total_questions: item.questions.length
        }
    })
}

export const formatForManage = (data: any[]) => {
    if (!data.length) return [];

    return data.map((item) => {
        return {
            name: item.title,
            url: item.url,
            status: capitalizeFirstLetter(item.status),
        }
    })
}

export const formatForAnalysis = (data: any[]) => {
    if (!data.length) return [];

    return data.map((item) => {
        return {
            name: item.title,
            url: item.url,
            status: capitalizeFirstLetter(item.status),
        }
    })
}

export const formatForAnalysisTable = (data: any[]) => {
    if (!data.length) return [];

    return data.map((item) => {

        return {
            id: item["student-id"],
            name: item.name,
            marks: item.marks,
            completedIn: item["completed-in"]
        }
    })
}