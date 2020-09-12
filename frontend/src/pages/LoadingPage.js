import React from 'react';
import { 
    Spinner
} from 'react-bootstrap';
  
function LoadingPage() {
  return (
    <table style={{ height: '100vh', width: '100%' }}>
      <tbody>
        <tr>
          <td className="align-middle text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
  
export default LoadingPage;