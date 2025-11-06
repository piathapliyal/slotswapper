import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup(){
  const nav = useNavigate();
  const [f, setF] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      await api.post("/auth/signup", f);
      nav("/login");
    }catch(e){
      setErr(e?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl p-4 border">
      <h2 className="text-xl font-semibold mb-4">Create an account</h2>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="border rounded-md px-3 py-2" placeholder="Name"
               value={f.name} onChange={e=>setF({...f, name:e.target.value})}/>
        <input className="border rounded-md px-3 py-2" placeholder="Email"
               value={f.email} onChange={e=>setF({...f, email:e.target.value})}/>
        <input className="border rounded-md px-3 py-2" type="password" placeholder="Password"
               value={f.password} onChange={e=>setF({...f, password:e.target.value})}/>
        <button className="bg-black text-white rounded-md px-3 py-2 hover:opacity-90">Sign up</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        Already have an account? <Link to="/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}
