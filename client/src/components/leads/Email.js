import React, { useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
const { TextArea } = Input;

function Email({ visible, toggleModal, id, getDetails }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    toggleModal();
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const res = await axios.patch(`/api/v1/lead/sendmail/${id}`, values);
      form.resetFields();
      toggleModal();
      getDetails(id)
      toast.success(res?.data?.msg);

    } catch (error) {
      toast.error(error?.response?.data?.msg);

    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Modal
        title="Compose Email"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Send Email
          </Button>,
        ]}
      >
        <Form form={form}>
        <Form.Item
            name="sentby"
            label="From"
            labelCol={{ span: 4 }}
            labelAlign="left"
            placeholder= "Enter Name"
            rules={[
              { required: true, message: "Please enter the email sender" },
            ]}            
          >
            <Input type="text" placeholder= "Enter Name"/>
          </Form.Item>
          <Form.Item
            name="to"
            label="To"
            labelCol={{ span: 4 }}
            labelAlign="left"
            
            rules={[
              { required: true, message: "Please enter the recipient email" },
            ]}
          >
            <Input type="email" placeholder="example@abc.com" />
          </Form.Item>
          <Form.Item
            name="subject"
            label="subject"
            labelCol={{ span: 4 }}
            labelAlign="left"
            
            rules={[
              { required: true, message: "Please enter the email subject" },
            ]}
          >
            <Input type="text" placeholder="Enter Subject" />
          </Form.Item>
          <Form.Item
            name="content"
            label="content"
            labelCol={{ span: 4 }}
            labelAlign="left"
            
            rules={[
              { required: true, message: "Please enter the email content" },
            ]}
          >
            <TextArea autoSize={{ minRows: 4 }}  placeholder="Enter You content"/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Email;
