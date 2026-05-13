import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  mono?: boolean
  error?: string | null
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false }
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }

type FieldProps = InputProps | TextareaProps

export const Field = forwardRef<HTMLInputElement | HTMLTextAreaElement, FieldProps>(function Field(
  { label, mono, error, ...rest },
  ref,
) {
  return (
    <div className="hm-field">
      <label>{label}</label>
      {('multiline' in rest && rest.multiline) ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`hm-input ${mono ? 'mono' : ''}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={`hm-input ${mono ? 'mono' : ''}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <div className="hm-error" style={{ fontSize: 12 }}>{error}</div>}
    </div>
  )
})
