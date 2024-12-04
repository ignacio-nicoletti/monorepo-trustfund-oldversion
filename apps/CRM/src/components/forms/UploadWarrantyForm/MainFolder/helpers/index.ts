import { MockData } from "~/src/server-actions/getMocks";
import { months } from "~/src/utils/month";

export function getCurrentMainFolderUrl(  mockData: MockData) {
    let currentMonthStr = months[new Date().getMonth()];
    let currentYear = new Date().getFullYear();

    let urls = mockData?.mainFolders

    let currentUrl = urls?.length ? urls.find(elem => elem.month === currentMonthStr && elem.year === currentYear) : undefined

    return currentUrl?.url ?? undefined
}
