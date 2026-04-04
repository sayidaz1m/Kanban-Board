import { Handle, Position } from "reactflow"
import { useEffect, useState } from "react"

type Props = {
  data: {
    label: string
    id: string
    onDelete: (id: string) => void
    onEdit: (id: string, title: string) => void
  }
}

export default function BlueprintNode({ data }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(data.label)

  useEffect(() => {
    setValue(data.label)
  }, [data.label])

  function saveEdit() {
    const trimmed = value.trim()

    if (!trimmed) {
      setValue(data.label)
      setIsEditing(false)
      return
    }

    if (trimmed !== data.label) {
      data.onEdit(data.id, trimmed)
    }

    setIsEditing(false)
  }

  function cancelEdit() {
    setValue(data.label)
    setIsEditing(false)
  }
  
  return (
    <div
      style={{
        background: "#1e1e2e",
        color: "white",
        borderRadius: 8,
        border: "2px solid #3b82f6",
        minWidth: 180,
        fontFamily: "sans-serif",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
      }}
    >
      <div
        style={{
          background: "#3b82f6",
          padding: "6px 10px",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          fontWeight: "bold",
          fontSize: 12
        }}
      >
        TASK
      </div>


      <div style={{ padding: 10 }}>
         {isEditing ? (
          <input
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit()
              if (e.key === "Escape") cancelEdit()
            }}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #3b82f6",
              outline: "none",
              background: "#111827",
              color: "white"
            }}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            style={{ cursor: "text" }}
          >
            {data.label}
          </div>
        )}
        
        <div style={{ marginTop: 8 }}>
          <button onClick={() => data.onDelete(data.id)}>delete</button>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}