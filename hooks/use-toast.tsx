import { toast } from 'sonner';

export const useToast = () => {
  return {
    toast: (options: {
      title: string;
      description?: string;
      variant?: 'default' | 'destructive' | 'success';
    }) => {
      const { title, description, variant = 'default' } = options;
      const message = description ? `${title}\n${description}` : title;
      
      switch (variant) {
        case 'destructive':
          toast.error(message);
          break;
        case 'success':
          toast.success(message);
          break;
        default:
          toast(message);
          break;
      }
    }
  };
};