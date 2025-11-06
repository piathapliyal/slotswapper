import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axios";

export default function Dashboard(){
  const qc = useQueryClient();

 
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => (await api.get("/events")).data
  });

 
  const createEvent = useMutation({
    mutationFn: (payload) => api.post("/events", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] })
  });

  
  const updateEvent = useMutation({
    mutationFn: ({id, ...payload}) => api.patch(`/events/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] })
  });

  const [f, setF] = useState({ title:"", startTime:"", endTime:"" });

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-6">
      <div className="bg-white rounded-xl p-4 border">
        <h3 className="font-semibold mb-3">Create Event</h3>
        <form className="grid md:grid-cols-4 gap-3"
              onSubmit={(e)=>{e.preventDefault(); createEvent.mutate(f);}}>
          <input className="border rounded-md px-3 py-2" placeholder="Title"
                 onChange={e=>setF(s=>({...s,title:e.target.value}))}/>
          <input className="border rounded-md px-3 py-2" type="datetime-local"
                 onChange={e=>setF(s=>({...s,startTime:e.target.value}))}/>
          <input className="border rounded-md px-3 py-2" type="datetime-local"
                 onChange={e=>setF(s=>({...s,endTime:e.target.value}))}/>
          <button className="bg-black text-white rounded-md px-3 py-2 hover:opacity-90">
            Create
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-4 border">
        <h3 className="font-semibold mb-3">My Events</h3>
        {isLoading ? <p>Loading...</p> : (
          <ul className="space-y-2">
            {events.map(e=>(
              <li key={e._id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">
                    {e.title} <span className="text-xs text-gray-500">[{e.status}]</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(e.startTime).toLocaleString()} → {new Date(e.endTime).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {e.status === "BUSY" && (
                    <button className="bg-black text-white rounded-md px-3 py-2"
                            onClick={()=>updateEvent.mutate({ id: e._id, status: "SWAPPABLE" })}>
                      Make Swappable
                    </button>
                  )}
                  {e.status === "SWAPPABLE" && (
                    <button className="bg-white text-black border rounded-md px-3 py-2"
                            onClick={()=>updateEvent.mutate({ id: e._id, status: "BUSY" })}>
                      Make Busy
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
