import { useParams, Link } from "react-router-dom"
import { useMemo } from "react"

const groupByDay = (timeBoxes: TimeBox[][]) => {
    const grouped: Record<string, TimeBox[]> = {}
    timeBoxes.forEach((set: {start:Date, end: Date}[]) => {
        const date = set[0].start.toDateString()
        if(!grouped[date]) {
            grouped[date] = []
        }
        grouped[date] = [...grouped[date], ...set].sort((a : TimeBox, b: TimeBox) => a.start.getTime() > b.start.getTime() ? 1 : -1)
    })
    return Object.values(grouped)
}

const ClientScheduleAppt = ({schedule, bookings, bookAppt}: { schedule: Record<number, TimeBox[]>, bookings: Record<number, Record<string, {id: number, confirmed: boolean, start: Date, end: Date}>>, bookAppt: (provider: number, {start, end}: TimeBox) => void}) => {
    const { providerId } = useParams()
    const provider = parseInt(providerId || "0", 10)
    const providerSchedule = schedule[provider] || []

    const providerScheduleSorted = Object.values(providerSchedule).sort((a,b) => a.start.getTime() > b.start.getTime() ? 1 : -1)
    const providerTimeBoxAvaliableSlots = useMemo(() => providerScheduleSorted.reduce((acc: TimeBox[][], {start, end}: TimeBox) => {
        const slots = []
        while (start.valueOf() < end.valueOf()) {
            const nextSlot = new Date(start.valueOf() + 15 * 60 * 1000)
            slots.push({start, end: nextSlot})
            start = nextSlot
        }
        return [...acc, slots]
    }, []), [providerScheduleSorted])
    
    const groupedByDay = groupByDay(providerTimeBoxAvaliableSlots)

    return <>
        <div className="inline-flex gap-2">
            {groupedByDay.map((timeBox: TimeBox[]) => <div key={`${timeBox[0].start}-${timeBox[timeBox.length - 1].end}`}>
                <h3>{timeBox[0].start.toDateString()}</h3>
                    {timeBox.map(({start, end}) => <div className="text-left" key={`${start}-${end}`}>
                        <div className="inline-flex">{start.toLocaleTimeString() + " - " + end.toLocaleTimeString()}</div> 
                        <button className="ml-2" disabled={!!bookings[provider]?.[`${start}-${end}`]} onClick={() => {bookAppt(provider, {start, end})}}>
                            {!!bookings[provider]?.[`${start}-${end}`] ? "❌ booked" : "book"}
                        </button>
                    </div>)}
            </div>)}
        </div>
        <div className="mt-4">
            <Link to={`/create-schedule/${provider}`}>set up</Link>
        </div>
        <div className="mt-2">
            <Link to={`/confirm-appt/${provider}`}>confirm</Link>
        </div>
    </>
}

export default ClientScheduleAppt