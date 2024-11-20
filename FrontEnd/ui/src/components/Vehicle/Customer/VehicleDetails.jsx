import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const VehicleDetails = ({ vehicle }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={vehicle.image}
        alt={vehicle.VehicleName}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {vehicle.VehicleName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Year: {vehicle.VehicleProductYear}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${vehicle.rentalPrice} per day
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Capacity: {vehicle.Capacity} persons
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fuel Type: {vehicle.FuelType}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
