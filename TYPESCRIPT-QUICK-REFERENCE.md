# TypeScript Quick Reference for FilmVault

## Common Patterns

### React Component Props
```typescript
import { Movie } from '../types';

interface Props {
  item: Movie;
  onSelect?: (id: number) => void;
}

const MovieCard: React.FC<Props> = ({ item, onSelect }) => {
  // Component logic
};
```

### Zustand Store
```typescript
import { create } from 'zustand';
import { User } from '../types';

interface StoreState {
  user: User | null;
  setUser: (user: User) => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### API Functions
```typescript
import axios from 'axios';
import { Watchlist } from '../types';

export const getWatchlists = async (): Promise<Watchlist[]> => {
  const response = await axios.get('/api/watchlists');
  return response.data;
};
```

### Event Handlers
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  // Handle click
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle submit
};
```

### useState Hook
```typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Movie[]>([]);
```

### useEffect Hook
```typescript
useEffect(() => {
  const fetchData = async (): Promise<void> => {
    const data = await getData();
    setData(data);
  };
  fetchData();
}, []);
```

### Express Route Handler
```typescript
import { Request, Response } from 'express';
import { AuthRequest } from '../types';

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Mongoose Model
```typescript
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', userSchema);
```

### Async Error Handling
```typescript
try {
  const result = await someAsyncFunction();
  return result;
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
  throw error;
}

// Or with axios
catch (err: any) {
  const message = err.response?.data?.message || 'An error occurred';
  throw new Error(message);
}
```

### Optional Chaining & Nullish Coalescing
```typescript
// Optional chaining
const username = user?.profile?.username;

// Nullish coalescing
const displayName = user?.username ?? 'Guest';

// Combined
const email = user?.contact?.email ?? 'no-email@example.com';
```

### Type Assertions
```typescript
// When you know more than TypeScript
const input = document.getElementById('myInput') as HTMLInputElement;

// Or
const data = JSON.parse(jsonString) as User;
```

### Union Types
```typescript
type MediaType = 'movie' | 'tv';
type Status = 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('loading');
```

### Utility Types
```typescript
// Partial - make all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'username' | 'email'>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Required - make all properties required
type RequiredUser = Required<User>;
```

## Import/Export Patterns

```typescript
// Named exports
export interface User { }
export const API_URL = 'http://localhost:5000';

// Default export
export default function Component() { }

// Import
import { User, API_URL } from './types';
import Component from './Component';
```

## Common Errors & Solutions

### Error: "Type 'null' is not assignable to type 'User'"
```typescript
// Solution: Use union type
const [user, setUser] = useState<User | null>(null);
```

### Error: "Property 'X' does not exist on type 'Y'"
```typescript
// Solution: Add optional chaining or type guard
if (user && 'email' in user) {
  console.log(user.email);
}
```

### Error: "Argument of type 'X' is not assignable to parameter of type 'Y'"
```typescript
// Solution: Ensure types match or use type assertion
const value = someValue as ExpectedType;
```

## Tips

1. Let TypeScript infer types when obvious
2. Use `interface` for object shapes
3. Use `type` for unions, primitives, or complex types
4. Avoid `any` - use `unknown` if type is truly unknown
5. Use strict mode for maximum type safety
