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
  const cls = `hm-input ${mono ? 'mono' : ''} ${error ? 'has-error' : ''}`.trim()
  return (
    <div className="hm-field">
      <label>{label}</label>
      {('multiline' in rest && rest.multiline) ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={cls}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={cls}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <div className="cls-field-err">{error}</div>}
    </div>
  )
})
