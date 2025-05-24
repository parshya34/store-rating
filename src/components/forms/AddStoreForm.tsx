
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export const AddStoreForm = ({ onClose, onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name) => {
    return name.length >= 20 && name.length <= 60;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAddress = (address) => {
    return address.length <= 400;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!validateName(formData.name)) {
      toast({
        title: "Invalid Name",
        description: "Name must be between 20 and 60 characters.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateAddress(formData.address)) {
      toast({
        title: "Invalid Address",
        description: "Address must be less than 400 characters.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be 8-16 characters with at least one uppercase letter and one special character.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Add to registered users as store owner
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      if (existingUsers.find(user => user.email === formData.email)) {
        toast({
          title: "Email Already Exists",
          description: "Please use a different email address.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const newStoreOwner = {
        id: Date.now(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        address: formData.address,
        role: 'store_owner'
      };

      existingUsers.push(newStoreOwner);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Add to stores
      const existingStores = JSON.parse(localStorage.getItem('stores') || '[]');
      const newStore = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        address: formData.address,
        overallRating: 0,
        totalRatings: 0,
        ownerId: newStoreOwner.id
      };

      existingStores.push(newStore);
      localStorage.setItem('stores', JSON.stringify(existingStores));

      toast({
        title: "Store Added Successfully",
        description: "Store owner account created and store added to the platform.",
      });

      onStoreAdded();
      onClose();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Store Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter store name (20-60 characters)"
          required
        />
        <p className="text-xs text-gray-500">{formData.name.length}/60 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Store Owner Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter store owner email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Store Address *</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter store address (max 400 characters)"
          rows={3}
          required
        />
        <p className="text-xs text-gray-500">{formData.address.length}/400 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Store Owner Password *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="8-16 chars, uppercase & special character"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Adding Store...' : 'Add Store'}
        </Button>
      </div>
    </form>
  );
};
