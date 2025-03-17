import LoadingPage from '@/components/loadingPage';
import ProtectedRoutes from '@/components/protectedRoutes';
import { Amplify } from 'aws-amplify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import updatedAwsConfig from './aws/awsConfig.h';

Amplify.configure(updatedAwsConfig());

const App = () => {
  return (
    <div className='App'>
      {/* <LoadingPage /> */}
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
