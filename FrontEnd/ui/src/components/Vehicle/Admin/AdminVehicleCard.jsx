import React from 'react';
import { Button, Card, CardContent, CardActions } from '@mui/material';

const AdminVehicleCard = ({ vehicle, onDelete, onUpdate }) => {
  return (
    <Card>
      <CardContent>
        <h2>{vehicle.VehicleName}</h2>
        {/* Display other vehicle details */}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => onUpdate(vehicle)}>
          Update
        </Button>
        <Button size="small" color="secondary" onClick={() => onDelete(vehicle._id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default AdminVehicleCard;
