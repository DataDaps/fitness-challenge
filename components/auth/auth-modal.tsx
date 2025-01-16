'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import AuthForm from './auth-form'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-0">
        <AuthForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  )
}

