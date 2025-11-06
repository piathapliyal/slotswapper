import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Requests(){
  const qc = useQueryClient();

  const { data: incoming = [] } = useQuery({
    queryKey: ["incoming"],
    queryFn: async () => (await api.get("/requests/incoming")).data
  });

  const { data: outgoing = [] } = useQuery({
    queryKey: ["outgoing"],
    queryFn: async () => (await api.get("/requests/outgoing")).data
  });

  const respond = useMutation({
    mutationFn: ({ id, accept }) => api.post(`/swap-response/${id}`, { accept }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["incoming"] });
      qc.invalidateQueries({ queryKey: ["outgoing"] });
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["market"] });
    }
  });

  return (
    <div className="max-w-4xl mx-auto mt-6 grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-4 border">
        <h3 className="font-semibold mb-3">Incoming</h3>
        <ul className="space-y-2">
          {incoming.map(r=>(
            <li key={r._id} className="border rounded-md p-3">
              <div className="text-sm text-gray-700">
                <b>{r.requester?.name}</b> wants to swap:
                <br/>Their <i>{r.mySlot?.title}</i> ⇄ Your <i>{r.theirSlot?.title}</i>
                <br/>Status: <b>{r.status}</b>
              </div>
              {r.status === "PENDING" && (
                <div className="flex gap-2 mt-2">
                  <button className="bg-black text-white rounded-md px-3 py-2"
                          onClick={()=>respond.mutate({ id: r._id, accept: true })}>
                    Accept
                  </button>
                  <button className="bg-white text-black border rounded-md px-3 py-2"
                          onClick={()=>respond.mutate({ id: r._id, accept: false })}>
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl p-4 border">
        <h3 className="font-semibold mb-3">Outgoing</h3>
        <ul className="space-y-2">
          {outgoing.map(r=>(
            <li key={r._id} className="border rounded-md p-3">
              <div className="text-sm text-gray-700">
                To <b>{r.responder?.name}</b>:
                <br/>My <i>{r.mySlot?.title}</i> ⇄ Their <i>{r.theirSlot?.title}</i>
                <br/>Status: <b>{r.status}</b>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
