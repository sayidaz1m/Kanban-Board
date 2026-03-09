import { Handle, Position } from "reactflow"

type Props = {
  data: {
    label: string
    id: string
    onDelete: (id: string) => void
    onEdit: (id: string) => void
  }
}

export default function BlueprintNode({ data }: Props) {
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
        {data.label}
        
        <div style={{ marginTop: 8 }}>
          <button onClick={() => data.onEdit(data.id)}>edit</button>
          <button onClick={() => data.onDelete(data.id)}>delete</button>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}