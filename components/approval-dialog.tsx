'use client';

import { useState } from 'react';
import { TimeEntry } from '@/types/time-entry';
import { ApprovalStatus } from '@/types/approval';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
  entry: TimeEntry | null;
  action: ApprovalStatus;
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onConfirm,
  entry,
  action,
}: ApprovalDialogProps) {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(notes || undefined);
      setNotes('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!entry) return null;

  const isApprove = action === 'approved';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isApprove ? 'Aprobar Registro' : 'Rechazar Registro'}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? '¿Estás seguro de aprobar este registro de tiempo?'
              : '¿Estás seguro de rechazar este registro de tiempo?'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Empleado:</span>
              <span className="text-sm font-medium">{entry.user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha:</span>
              <span className="text-sm font-medium">{entry.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Horas:</span>
              <span className="text-sm font-medium">
                {Math.floor((entry.total_worked_minutes || 0) / 60)}h{' '}
                {(entry.total_worked_minutes || 0) % 60}m
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notas {isApprove ? '(opcional)' : '(requerido para rechazo)'}
            </Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={
                isApprove
                  ? 'Agrega un comentario sobre la aprobación...'
                  : 'Explica el motivo del rechazo...'
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || (!isApprove && !notes)}
            className={isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isLoading
              ? 'Procesando...'
              : isApprove
              ? 'Aprobar'
              : 'Rechazar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
