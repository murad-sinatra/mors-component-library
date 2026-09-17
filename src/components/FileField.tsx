import { useState, type ChangeEvent, type DragEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Icon } from './Icon';

export interface FileFieldProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onDragOver' | 'onDragLeave' | 'onDrop'
    >,
    FieldShellProps {
  prompt?: ReactNode;
  onFilesChange?: (files: File[]) => void;
}

function listFrom(list: FileList | null): File[] {
  return list ? Array.from(list) : [];
}

export function FileField({
  label,
  description,
  error,
  size = 'md',
  block = true,
  prompt = 'Drop files here or browse',
  onFilesChange,
  className,
  id,
  required,
  disabled,
  multiple,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: FileFieldProps) {
  const { ids, validity } = useFieldControl(id, required, error);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const apply = (next: File[]) => {
    setFiles(next);
    validity.reportValue(next.length > 0 ? next[0]!.name : '');
    onFilesChange?.(next);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    apply(listFrom(event.currentTarget.files));
  };

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={validity.error}
      required={required}
      size={size}
      block={block}
    >
      <div
        className={cx(
          'mors-file',
          dragging && 'mors-file--dragging',
          disabled && 'mors-is-disabled',
          className,
        )}
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          const dropped = listFrom(event.dataTransfer.files);
          apply(multiple ? dropped : dropped.slice(0, 1));
        }}
      >
        <label className="mors-file-hit" htmlFor={ids.id}>
          <input
            id={ids.id}
            type="file"
            className="mors-file-input mors-visually-hidden"
            disabled={disabled}
            required={required}
            multiple={multiple}
            aria-invalid={validity.error ? true : undefined}
            aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error), ariaDescribedBy)}
            {...rest}
            onInvalid={validity.onInvalid}
            onChange={onChange}
          />
          <span className="mors-file-icon" aria-hidden="true">
            <Icon name="upload" />
          </span>
          <span className="mors-file-copy">
            <span className="mors-file-prompt">{prompt}</span>
            {files.length > 0 && (
              <span className="mors-file-names">{files.map((file) => file.name).join(', ')}</span>
            )}
          </span>
        </label>
      </div>
    </Field>
  );
}
