import React, { useState } from 'react';
import { Button, Form, FormInstance, Input, Space } from 'antd';
import {
  AppRichTextInput,
  SelectMailAutomation,
  SelectResource,
} from '@/components/common';
import { useGetMailAutomationPlaceholders } from '@/apis';

interface MailBlueprintFormProps {
  form: FormInstance;
  onFinish?: (values: any) => Promise<void>;
  isEaditing?: boolean;
}

export const MailAutomationForm: React.FC<MailBlueprintFormProps> = ({
  form,
  onFinish,
  isEaditing,
}) => {
  const [focusedField, setFocusedField] = useState<string>();
  const [subjectContent, setSubjectContent] = useState<string>();
  const [bodyContent, setBodyContent] = useState<string>();

  const resource = Form.useWatch('resourceName', form);
  const automationName = Form.useWatch('name', form);

  const { data } = useGetMailAutomationPlaceholders(resource);

  const handlePlaceholderClick = (placeholder: string) => {
    if (focusedField === 'body') {
      setBodyContent((prevContent) => {
        const updatedContent = prevContent
          ? prevContent + `{{${placeholder}}}`
          : `{{${placeholder}}}`;
        form.setFieldsValue({ bodyContent: updatedContent });
        return updatedContent;
      });
    } else if (focusedField === 'subject') {
      setSubjectContent((prevContent) => {
        const updatedContent = prevContent
          ? prevContent + `{{${placeholder}}}`
          : `{{${placeholder}}}`;
        form.setFieldsValue({ subjectContent: updatedContent });
        return updatedContent;
      });
    }
  };

  return (
    <>
      <Form form={form} layout='vertical' onFinish={onFinish} className='mt-4'>
        <Form.Item name='id' hidden />
        <Form.Item
          name='resourceName'
          label={
            <span className='text-paragraph dark:text-paragraph-dark'>
              Resource Name
            </span>
          }
          rules={[{ required: true, message: 'Please select a resource name' }]}
        >
          <SelectResource
            size='large'
            onChange={() => {
              form.setFieldsValue({ name: null });
            }}
          />
        </Form.Item>

        {resource && (
          <Form.Item
            name='name'
            label={
              <span className='text-paragraph dark:text-paragraph-dark'>
                Automation Name
              </span>
            }
            rules={[
              { required: true, message: 'Please select automation name' },
            ]}
          >
            {resource === 'promotion' ? (
              <Input size='large' />
            ) : (
              <SelectMailAutomation resource={resource} size='large' />
            )}
          </Form.Item>
        )}

        {isEaditing ? (
          <>editing</>
        ) : (
          <>
            {automationName && (
              <>
                {data.length > 0 && (
                  <>
                    <div>Placeholders</div>
                    <div className='flex flex-wrap gap-x-1'>
                      {data?.map((placeholder: string, index: number) => (
                        <div
                          key={index}
                          onClick={() => handlePlaceholderClick(placeholder)}
                          className='cursor-pointer text-primary hover:underline'
                        >
                          {placeholder}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Form.Item
                  name='subjectContent'
                  label={
                    <span className='text-paragraph dark:text-paragraph-dark'>
                      Email Subject
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter email subject' },
                  ]}
                >
                  <Input
                    placeholder='Subject'
                    onFocus={() => setFocusedField('subject')}
                    value={subjectContent}
                    onChange={(e) => setSubjectContent(e.target.value)}
                    className='h-10 rounded-lg dark:border-background-dark-300 dark:bg-background-dark-200 dark:text-paragraph-dark'
                  />
                </Form.Item>
                <Form.Item
                  name='bodyContent'
                  label={
                    <span className='text-paragraph dark:text-paragraph-dark'>
                      Email Body
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter description' },
                  ]}
                >
                  <AppRichTextInput
                    placeholder='Enter description'
                    onFocus={() => setFocusedField('body')}
                    className='dark:bg-background-dark-200'
                    value={bodyContent}
                    onChange={(value) => {
                      setBodyContent(value);
                      form.setFieldsValue({ bodyContent: value });
                    }}
                  />
                </Form.Item>
              </>
            )}
          </>
        )}
        <Space className='w-full justify-center'>
          <Button
            type='primary'
            htmlType='submit'
            className='rounded-lg bg-primary hover:bg-primary-600 dark:bg-primary-dark dark:hover:bg-primary-dark-600'
          >
            {isEaditing ? `Edit ` : `Save `} Automation
          </Button>
        </Space>
      </Form>
    </>
  );
};
