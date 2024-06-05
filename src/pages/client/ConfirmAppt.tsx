import { useParams } from "react-router-dom"


const ConfirmAppt = ({bookings, confirmAppt}: {bookings: Record<number, Record<string, any> | undefined>, confirmAppt: (patientId: number, providerId: number, time: string) => void}) => {
    const { patientId } = useParams()
    const patient = parseInt(patientId || "0", 10)
    const patientBookings = bookings[patient] || {}

    return <>
        <div>
            {Object.entries(patientBookings).map(([time, appt]) => 
            <div className="flex flex-row" key={time}>
                <div className="flex pt-3 mr-2">{`${appt.start.toDateString()} ${appt.start.toLocaleTimeString()} - ${appt.end.toLocaleTimeString()}`}</div> 
                {appt.confirmed ? <div className="pt-3">👍 confirmed</div> : <button onClick={() => confirmAppt(patient, 0, time) }>click confirm appointment</button>}
            </div>)}
        </div>
    </>
}

export default ConfirmAppt