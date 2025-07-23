import { toast as sonnerToast } from 'sonner'

type Toast = {
  id: string
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'destructive'
}

export const useToast = () => {
  const toast = ({
    title,
    description,
    variant = 'default',
    action,
    ...props
  }: Omit<Toast, 'id'>) => {
    if (variant === 'destructive') {
      return sonnerToast.error(title || description, {
        description: title ? description : undefined,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        ...props,
      })
    }
    
    return sonnerToast.success(title || description, {
      description: title ? description : undefined,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      ...props,
    })
  }

  return {
    toast,
  }
}
