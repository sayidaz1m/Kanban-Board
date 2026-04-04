import { useEffect } from "react"
import ReactFlow, { Background, useNodesState } from "reactflow"
import type { Node, Connection } from "reactflow"
import "reactflow/dist/style.css"
import BlueprintNode from "./components/BlueprintNode"
import { addEdge, useEdgesState } from "reactflow"
import { Controls } from "reactflow"


type Task = {
  id: string
  title: string
  x: number
  y: number
}

const nodeTypes = {
  blueprint: BlueprintNode
}

function App() {
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  async function onConnect(connection: Connection) {
    setEdges((eds) => addEdge(connection, eds))

    await fetch("http://localhost:8080/edges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: Date.now().toString(),
        source: connection.source,
        target: connection.target
      })
    })
  }

  async function loadEdges() {
    const res = await fetch("http://localhost:8080/edges")
    const edges = await res.json()

    setEdges(edges)
  }
  
  async function loadTasks() {
    const res = await fetch("http://localhost:8080/tasks")
    const tasks: Task[] = await res.json()

    const formatted: Node[] = tasks.map(task => ({
      id: task.id,
      position: { x: task.x, y: task.y },
      data: {
        label: task.title,
        id: task.id,
        onDelete: deleteTask,
        onEdit: editTask
      },
      type: "blueprint"
    }))

    setNodes(formatted)
  }


  async function deleteTask(id: string) {
    await fetch(`http://localhost:8080/tasks?id=${id}`, {
      method: "DELETE"
    })

    setNodes((nds) => nds.filter(n => n.id !== id))
  }


  async function editTask(id: string, title: string) {
    let x = 0
    let y = 0
    let found = false

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          x = n.position.x
          y = n.position.y
          found = true

          return {
            ...n,
            data: {
              ...n.data,
              label: title
            }
          }
        }

        return n
      })
    )

    if (!found) return

    await fetch("http://localhost:8080/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        title,
        x: Math.round(x),
        y: Math.round(y)
      })
    })
  }


  async function addTask() {
    const newTask = {
      id: Date.now().toString(),
      title: "New Task",
      x: 200,
      y: 200
    }
    await fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    })

    setNodes((nds) => [
      ...nds,
      {
        id: newTask.id,
        position: { x: newTask.x, y: newTask.y },
        data: {
          label: newTask.title,
          id: newTask.id,
          onDelete: deleteTask,
          onEdit: editTask
        },
        type: "blueprint"
      }
    ])
  }


  async function deleteEdge(id: string) {
    await fetch(`http://localhost:8080/edges?id=${id}`, {
      method: "DELETE"
    })

    setEdges((eds) => eds.filter((e) => e.id !== id))
  }


  async function saveViewport(viewport: { x: number; y: number; zoom: number }) {
    localStorage.setItem("viewport", JSON.stringify(viewport))
  }
  

  async function savePosition(node: Node) {

    const body = {
      id: String(node.id),
      title: String(node.data.label),
      x: Math.round(node.position.x),
      y: Math.round(node.position.y)
    }

    console.log("sending:", body)

    const res = await fetch("http://localhost:8080/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    console.log("status:", res.status)
  }

  useEffect(() => {
    loadTasks()
    loadEdges()
  }, [])

  const savedViewport = localStorage.getItem("viewport")
  const defaultViewport = savedViewport
    ? JSON.parse(savedViewport)
    : { x: 0, y: 0, zoom: 1 }


  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      <button
        onClick={addTask}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          background: "#3b82f6",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer"
        }}>
        + Add Task
      </button>
        
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={(_, edge) => deleteEdge(edge.id)}
        nodeTypes={nodeTypes}
        onNodeDragStop={(_, node) => savePosition(node)}
        onMoveEnd={(_, viewport) => saveViewport(viewport)}
        defaultViewport={defaultViewport}
        >
        <Background gap={20} size={1} color="#2a2a2a" />
        <Controls />
      </ReactFlow>

    </div>
  )
}

export default App
