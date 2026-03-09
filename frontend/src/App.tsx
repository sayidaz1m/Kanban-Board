import { useEffect } from "react"
import ReactFlow, { Background, useNodesState } from "reactflow"
import type { Node, Connection } from "reactflow"
import "reactflow/dist/style.css"
import BlueprintNode from "./components/BlueprintNode"
import { addEdge, useEdgesState } from "reactflow"
import { MiniMap, Controls } from "reactflow"


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


  async function editTask(id: string) {
    const title = prompt("New title")
    if (!title) return
    const node = nodes.find(n => n.id === id)
    if (!node) return
    await fetch("http://localhost:8080/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        title,
        x: node.position.x,
        y: node.position.y
      })
    })

    setNodes((nds) =>
      nds.map(n =>
        n.id === id
          ? {
            ...n,
            data: {
              ...n.data,
              label: title
            }
          }
        : n
      )
    )
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
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes} 
        onNodeDragStop={(_, node) => savePosition(node)} 
        fitView>
        <Background gap={20} size={1} color="#2a2a2a" />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default App
