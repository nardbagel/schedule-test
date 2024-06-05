import { useState } from "react"
import { useParams, Link } from "react-router-dom"

const groupByDay = (timeBoxes: TimeBox[]) => {
    const grouped: Record<string, TimeBox[]> = {}
    timeBoxes.forEach((timeBox: TimeBox) => {
        const date = timeBox.start.toDateString()
        if(!grouped[date]) {
            grouped[date] = []
        }
        grouped[date] = [...grouped[date], timeBox].sort((a : TimeBox, b: TimeBox) => a.start.getTime() > b.start.getTime() ? 1 : -1)
    })
    return Object.values(grouped)
}

export default ({schedule, setSchedule}: { schedule: Record<number, TimeBox[]>, setSchedule: (providerId: number, {start, end}: TimeBox) => void }) => {
    const { providerId } = useParams()
    const providerSchedule = schedule[parseInt(providerId || "0", 10)] || []
    const [dateToAdd, setDateToAdd] = useState<string>()
    const [timeStart, setTimeStart] = useState<string>()
    const [timeEnd, setTimeEnd] = useState<string>()

    const groupedByDay = groupByDay(providerSchedule)

    return <>
        <div className="inline-flex gap-2 mb-2">
        {groupedByDay.map((dayGroup) => 
            <div key={dayGroup[0].start.toDateString()}>
                <div>{dayGroup[0].start.toDateString()}</div>
                <div>{dayGroup.map(({start, end} : TimeBox) => 
                    <div key={`${start}-${end}`}>
                        <div>{`${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`}</div>
                    </div>)}
                </div>
            </div>)}
        </div>
        <div className="flex gap-2">
            <input type="date" onChange={(e) => setDateToAdd(e.target.value)} />
            <input type="time" onChange={(e) => setTimeStart(e.target.value)} />
            <input type="time" onChange={(e) => setTimeEnd(e.target.value)} />
        </div>
        <button className="mt-4" disabled={!dateToAdd || !timeStart || !timeEnd} onClick={() => 
            setSchedule(parseInt(providerId || "0", 10), {start: new Date(`${dateToAdd} ${timeStart}`), end: new Date(`${dateToAdd} ${timeEnd}`)
        })}>add to schedule</button>
        <div className="mt-4">
            <Link to={`/schedule-appt/${providerId}`}>Book</Link>
        </div>
    </>
}
