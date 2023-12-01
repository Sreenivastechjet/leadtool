import React, { useState, useEffect, useContext } from "react";
import { Modal, Input } from "antd";
import {GlobalContext} from "../../GlobalContext"
import { getAllTodos, addTodo, deleteTodo, updateTodo } from "../../store/TodoSlice";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import "./dashboard.css"
import { toast } from 'react-toastify';

function ToDo() {
  const [showEventModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedItemId, setEditedItemId] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const context = useContext(GlobalContext);

  const todos = useSelector((state) => state.todo.todos);
  const [userId] = context.authApi.userId;
  // const [todos] = context.authApi.todos;
  const dispatch = useDispatch();

  const toggleModal = () => {
    setShowModal(!showEventModal);
  };

  const modelClose = () => {
    setShowModal(false);
    setEditMode(false);
    setEditedItemId(null);
    setDate("");
    setTitle("");
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditedItemId(item._id);
    setTitle(item.title);
    setDate(item.date);
    toggleModal();
  };

  useEffect(() => {
    dispatch(getAllTodos(userId));
  }, [userId]);

  const handleAddTodo = () => {
    const newTodo = {
      title: title,
      date: date,
    };
    dispatch(addTodo({ userId, todoData: newTodo }))
      .then((res) => {
        // console.log("res",res.payload)
        if (res) {
          toast.success(res.payload)
          setTitle("");
          setDate("");
          setShowModal(false);
          dispatch(getAllTodos(userId));

        }
      })
      .catch((err) => {
        toast.error(err.response.data.msg)
      });
  };

  const handleDeleteTodo = (todoId) => {
    dispatch(deleteTodo({ userId, todoId }))
      .then((res) => {
        if (res) {
          dispatch(getAllTodos(userId));
          toast.warning(res.payload)
        }
      })
      .catch((err) => {
        toast.error(err.response.data.msg)
      });
  };
  const handleUpdateTodo = () => {
    const updatedTodo = {
      title: title,
      date: date,
    };

    dispatch(updateTodo({ userId, todoId: editedItemId, todoData: updatedTodo }))
      .then((res) => {
        if (res) {
          toast.success(res.payload)
          setEditMode(false);
          setEditedItemId(null);
          setTitle("");
          setDate("");
          setShowModal(false);
          dispatch(getAllTodos(userId));
        }
      })
      .catch((err) => {
        toast.error(err.response.data.msg)
      });
  };
  return (
    <div className="">
      <div className="d-flex justify-content-between p-2 align-items-center">
        <h5>My To-Do</h5>
        <button className="btn btn-primary" onClick={toggleModal}>
          + Add To DO
        </button>
      </div>
      <hr className="pt-0 mt-0" style={{ border: "2px solid gray" }} />
      <div
        className=""
        style={{
          maxHeight: "60vh",
          minHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <div className="p-2">
          {todos?.map((item, i) => {
            return (
              <div className="card p-2 m-1" style={{borderLeft:"2px solid pink"}}>
                <div className="row">
                  <div className="col-8 p-2">
                    <p className="">Title : {item.title}</p>
                    <span>Date: {item.date}</span>
                  </div>
                  <div className="col-4 p-2 d-flex align-items-center">
                    <div>
                    <button
                      className="btn btnbg m-1"
                      onClick={() => handleDeleteTodo(item._id)}
                    >
                      <RiDeleteBin5Line color="red" />
                    </button>
                    </div>
                    <div>
                    <button className="btn btn2bg m-1" onClick={() => handleEdit(item)}>
                      <FiEdit color="purple" />
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        title="My TO Do"
        open={showEventModal}
        // onOk={handleAddTodo}
        // onCancel={modelClose}
        // okText="Create"
        onCancel={modelClose}
        onOk={editMode ? handleUpdateTodo : handleAddTodo}
        okText={editMode ? "Update" : "Create"}
      >
        <div>
          <div className="row p-2">
            <div className="col-3">
              <p>Todo Title</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="Description...."
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="row p-2">
            <div className="col-3">
              <p>To Do Date</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="date...."
                type="date"
                name="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ToDo;

