import { Button, Divider, Modal, ModalProps } from 'antd';
import React from 'react';

type AppModalProps = ModalProps & {
  title: React.ReactNode;
  children: React.ReactNode;
};

export const AppModal: React.FC<AppModalProps> = ({
  title,
  children,
  footer,
  ...props
}) => {
  return (
    <Modal
      {...props}
      footer={
        footer ? (
          footer
        ) : footer !== null ? (
          <div className='flex w-full flex-row gap-3'>
            <Button
              {...props.okButtonProps}
              type='primary'
              size='large'
              onClick={props?.onOk ? props.onOk : () => {}}
            >
              {props?.okText ?? 'Ok'}
            </Button>
            <Button
              size='large'
              {...props?.cancelButtonProps}
              onClick={props?.onCancel ? props.onCancel : () => {}}
            >
              {props?.cancelText ?? 'Cancel'}
            </Button>
          </div>
        ) : null
      }
      title={
        <div>
          <div className='text-gray2 flex w-full justify-center text-[16px]'>
            {title}
          </div>
          <Divider className='m-0' />
        </div>
      }
    >
      <div className=''>{children}</div>
    </Modal>
  );
};
