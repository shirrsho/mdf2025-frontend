import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { Pencil, Eye, EyeOff, Trash2, Mail } from 'lucide-react';
import { SizeType } from 'antd/es/config-provider/SizeContext';

type ActionButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: SizeType;
  href?: string;
  tooltip?: string;
};

export const ActionButton: React.FC<ActionButtonProps> & {
  Edit: React.FC<ActionButtonProps>;
  Hide: React.FC<ActionButtonProps>;
  Unhide: React.FC<ActionButtonProps>;
  Delete: React.FC<ActionButtonProps>;
  Details: React.FC<ActionButtonProps>;
  SendMail: React.FC<ActionButtonProps>;
} = ({ children, onClick, disabled, size = 'small', tooltip }) => {
  return (
    <>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement, {
          onClick,
          disabled,
          size,
          tooltip,
          key: index,
        })
      )}
    </>
  );
};

ActionButton.Edit = function EditButton({
  onClick,
  disabled,
  href,
  tooltip,
  size = 'small',
}) {
  return (
    <Tooltip title={tooltip ?? 'Edit'}>
      <Button
        size={size}
        type='text'
        disabled={disabled}
        href={href}
        onClick={(event: any) => {
          event.stopPropagation();
          onClick && onClick();
        }}
        icon={<Pencil className='text-primary hover:scale-105' />}
      />
    </Tooltip>
  );
};

ActionButton.Hide = function HideButton({ onClick, disabled, size = 'small' }) {
  return (
    <Tooltip title='Hide'>
      <Popconfirm
        okText='Yes'
        placement='top'
        onConfirm={(event: any) => {
          event.stopPropagation();
          onClick && onClick();
        }}
        onCancel={() => {}}
        title='Warning!!!!'
        description='Are you sure to hide?'
      >
        <Button
          size={size}
          type='text'
          disabled={disabled}
          onClick={(event: any) => {
            event.stopPropagation();
          }}
          icon={<Eye className='text-primary hover:scale-105' />}
        />
      </Popconfirm>
    </Tooltip>
  );
};

ActionButton.Unhide = function UnhideButton({
  onClick,
  disabled,
  size = 'small',
}) {
  return (
    <Tooltip title='Unhide'>
      <Popconfirm
        okText='Yes'
        placement='top'
        onConfirm={(event: any) => {
          event.stopPropagation();
          onClick && onClick();
        }}
        onCancel={() => {}}
        title='Warning!!!!'
        description='Are you sure to unhide?'
      >
        <Button
          size={size}
          type='text'
          disabled={disabled}
          onClick={(event: any) => {
            event.stopPropagation();
          }}
          icon={<EyeOff className='text-primary hover:scale-105' />}
        />
      </Popconfirm>
    </Tooltip>
  );
};

ActionButton.Delete = function DeleteButton({
  onClick,
  disabled,
  size = 'small',
}) {
  return (
    <Tooltip title='Delete'>
      <Popconfirm
        okText='Yes'
        placement='top'
        okButtonProps={{
          danger: true,
        }}
        onConfirm={(event: any) => {
          event.stopPropagation();
          onClick && onClick();
        }}
        onCancel={() => {}}
        title='Warning!!!!'
        description='Are you sure to delete?'
      >
        <Button
          size={size}
          type='text'
          disabled={disabled}
          onClick={(event: any) => {
            event.stopPropagation();
          }}
          icon={<Trash2 className='text-danger hover:scale-105' />}
        />
      </Popconfirm>
    </Tooltip>
  );
};

ActionButton.Details = function HideButton({ disabled, href, size = 'small' }) {
  return (
    <Tooltip title='Details'>
      <Button
        size={size}
        type='text'
        disabled={disabled}
        onClick={(event: any) => {
          event.stopPropagation();
        }}
        href={href}
        icon={<Eye className='text-primary hover:scale-105' />}
      />
    </Tooltip>
  );
};

ActionButton.SendMail = function SendMailButton({ onClick, tooltip }) {
  return (
    <Tooltip title={tooltip ?? 'Send Mail'}>
      <Button
        size='middle'
        type='text'
        onClick={(event: any) => {
          event.stopPropagation();
          onClick && onClick();
        }}
        icon={<Mail className='text-primary hover:scale-105' />}
      />
    </Tooltip>
  );
};

ActionButton.displayName = 'ActionButton';
