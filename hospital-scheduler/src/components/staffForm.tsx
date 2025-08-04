// src/components/StaffForm.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { staffService } from '../services/firebaseService'; // Import your service
import { useAuth } from '../context/MockAuthContext'; // For role check

interface StaffFormData {
  name: string;
  email: string;
  role: 'doctor' | 'nurse' | 'tech' | 'admin';
  departmentId: string;
  certifications: string[]; // e.g., ['Emergency', 'Trauma']
  maxHoursPerWeek: number;
  preferredShifts: string[]; // e.g., ['day', 'weekend']
  unavailableDates: string[]; // ISO dates
  hireDate: string; // ISO date
  performanceRating: number;
}

const StaffForm: React.FC = () => {
  const { isAdmin } = useAuth(); // Ensure only admins can add
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormData>();

  const onSubmit: SubmitHandler<StaffFormData> = async (data) => {
    if (!isAdmin) return alert('Only admins can add staff');
    try {
      await staffService.createStaff({ ...data, isActive: true });
      alert('Staff added successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" {...register('name', { required: true })} className="mt-1 block w-full border rounded p-2" />
        {errors.name && <span className="text-red-500">Required</span>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" type="email" {...register('email', { required: true })} className="mt-1 block w-full border rounded p-2" />
        {errors.email && <span className="text-red-500">Required</span>}
      </div>
      {/* Add more fields similarly: role (select), certifications (multi-select or input array), etc. */}
      {/* For arrays: Use comma-separated input and split, or a multi-input component */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Staff</button>
    </form>
  );
};

export default StaffForm;