'use client'
import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage'
import {
  collection, addDoc, updateDoc,Timestamp, doc, deleteDoc, query, orderBy, writeBatch, onSnapshot
} from 'firebase/firestore'
import { storage, db } from '@/utils/firebase'
import { UploadCloud, Loader2, Trash2, Pencil, Eye, EyeOff, Move } from 'lucide-react'
import { X } from 'lucide-react'
type Media = {
  id: string
  title: string
  src: string
  type: 'photo' | 'video'
  visible: boolean
  position: number
}

type Message = {
  id: string
  name: string
  email: string
  message: string
  timestamp?: Timestamp
}


function SortableItem({ item, onToggle, onEdit, onDelete }: {
  item: Media
  onToggle(i: Media): void
  onEdit(i: Media): void
  onDelete(i: Media): void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="backdrop-blur-sm bg-white/5 border border-zinc-700 p-4 rounded-xl flex items-center space-x-4 transition hover:bg-white/10 shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab text-zinc-400 hover:text-cyan-400">
        <Move size={20} />
      </div>
      <div className="w-20 h-20 border border-zinc-700 rounded-md overflow-hidden">
        {item.type === 'photo'
          ? <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
          : <video src={item.src} muted loop autoPlay className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold">{item.title}</div>
        <div className="text-sm text-zinc-400">Visible: {item.visible ? 'Yes' : 'No'}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onToggle(item)} className="hover:text-cyan-500 text-zinc-400 transition">{item.visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        <button onClick={() => onEdit(item)} className="hover:text-yellow-400 text-zinc-400 transition"><Pencil size={18} /></button>
        <button onClick={() => onDelete(item)} className="hover:text-red-500 text-zinc-400 transition"><Trash2 size={18} /></button>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [tab, setTab] = useState<'photo' | 'video'>('photo')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [editing, setEditing] = useState<{ id: string, title: string } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [progress, setProgress] = useState(0)
  const emojis = ['🦄', '🍕', '👾', '🎯', '🧃', '🍉', '🧁', '🪩', '🐸', '🤹‍♀️']
  const [showMessages, setShowMessages] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const sensors = useSensors(useSensor(PointerSensor))
  console.log(progress)
  useEffect(() => {
    const q = query(collection(db, tab), orderBy('position'))
    const unsub = onSnapshot(q, (snap) => {
      setMedia(snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Media, 'id'>)
      })))
    })
    return () => unsub()
  }, [tab])
  useEffect(() => {
    if (!showMessages) return
    const q = query(collection(db, 'msg'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, 'id'>)
      })))
    })
    return () => unsub()
  }, [showMessages])

  const DeleteMessage = async (id: string) => {
    const res = await Swal.fire({
      title: 'Delete this message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
    })
    if (!res.isConfirmed) return
    await deleteDoc(doc(db, 'msg', id))
    Swal.fire('Deleted!', '', 'success')
  }



  const upload = async () => {
    if (!file || !title) return Swal.fire('Missing Data', 'Please provide file and title.', 'warning')
    setUploading(true); setProgress(0)

    Swal.fire({
      title: 'Uploading...',
      html: `<div id="progress-bar" style="font-size:2rem;">⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛</div>`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })



    const task = uploadBytesResumable(ref(storage, `events/${tab}/${file.name}`), file)
    task.on('state_changed', snap => {
      const pct = (snap.bytesTransferred / snap.totalBytes) * 100
      setProgress(pct)
      const bar = emojis.slice(0, Math.floor(pct / 10)).join('') + '⬛'.repeat(10 - Math.floor(pct / 10))
      const el = Swal.getHtmlContainer()?.querySelector('#progress-bar')
      if (el) el.textContent = bar
    }, err => {
      Swal.fire('Error', err.message, 'error')
      setUploading(false)
    }, async () => {
      const url = await getDownloadURL(task.snapshot.ref)
      const pos = media.length ? Math.max(...media.map(m => m.position)) + 1 : 0
      await addDoc(collection(db, tab), { title, src: url, type: tab, visible: true, position: pos })
      setUploading(false)
      Swal.fire('Done!', 'Uploaded successfully 🎉', 'success')
      setTitle('')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
    })
  }

  const toggle = async (item: Media) => {
    await updateDoc(doc(db, tab, item.id), { visible: !item.visible })
  }

  const startEdit = (item: Media) => setEditing({ id: item.id, title: item.title })

  const rename = async () => {
    if (!editing) return
    await updateDoc(doc(db, tab, editing.id), { title: editing.title })
    setEditing(null)
    Swal.fire('Renamed', 'Title updated 🎉', 'success')
  }

  const del = async (item: Media) => {
    const res = await Swal.fire({ title: 'Delete?', text: 'This will remove the file permanently.', icon: 'warning', showCancelButton: true })
    if (!res.isConfirmed) return
    await deleteDoc(doc(db, tab, item.id))
    await deleteObject(ref(storage, item.src.substring(item.src.indexOf('/o/') + 3).split('?')[0]))
    Swal.fire('Deleted', 'File removed ❌', 'success')
  }

  const handleDragEnd = async (e: DragEndEvent) => {
    const iOld = media.findIndex(m => m.id === e.active.id)
    const iNew = media.findIndex(m => m.id === e.over?.id)
    if (iOld < 0 || iNew < 0) return
    const reordered = arrayMove(media, iOld, iNew)
    const batch = writeBatch(db)
    reordered.forEach((m, idx) => batch.update(doc(db, tab, m.id), { position: idx }))
    await batch.commit()
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white space-y-10 font-sans">
      <h1 className='text-4xl font-bold underline'>Admin Panel</h1>
      <div className="flex justify-end">
        <button
          onClick={() => setShowMessages(true)}
          className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-xl text-white hover:bg-zinc-700 transition"
        >
          📬 View Messages
        </button>
      </div>
      <div className="flex flex-wrap gap-4 bg-white/5 backdrop-blur p-6 rounded-2xl border border-zinc-700 shadow-md">
        <select value={tab} onChange={e => setTab(e.target.value as 'photo' | 'video')} className="bg-zinc-900 border border-zinc-700 text-sm rounded-xl px-3 py-2 text-white focus:ring-cyan-500">
          <option value="photo">📸 Photo</option>
          <option value="video">🎥 Video</option>
        </select>
        <input ref={fileRef} type="file" accept={tab === 'photo' ? 'image/*' : 'video/*'} onChange={e => setFile(e.target.files?.[0] || null)} className="bg-zinc-900 border border-zinc-700 text-sm rounded-xl px-3 py-2 text-white w-full md:w-auto" />
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="bg-zinc-900 border border-zinc-700 text-sm rounded-xl px-3 py-2 text-white w-full md:flex-1" />
        <button onClick={upload} disabled={uploading} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-5 py-2 rounded-xl transition shadow hover:scale-105 active:scale-95">
          {uploading ? <Loader2 className="animate-spin" /> : <UploadCloud />} Upload
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl space-y-4 w-80">
            <h2 className="text-black text-lg font-semibold">Edit Title</h2>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full border rounded px-3 py-2" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-zinc-200 rounded">Cancel</button>
              <button onClick={rename} className="px-4 py-2 bg-cyan-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {showMessages && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative shadow-xl">
            <button
              onClick={() => setShowMessages(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white">User Messages</h2>

            {messages.length === 0 ? (
              <p className="text-zinc-400 text-sm">No messages found.</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-2"
                >
                  <div className="text-xs text-zinc-400">
                    {msg.timestamp?.toDate().toLocaleString() || 'Unknown date'}
                  </div>
                  <div className="font-semibold">{msg.name} ({msg.email})</div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => DeleteMessage(msg.id)}
                      className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}



      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={media.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {media.map(item => (
              <SortableItem key={item.id} item={item} onToggle={toggle} onEdit={startEdit} onDelete={del} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
