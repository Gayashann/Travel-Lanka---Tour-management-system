// src/components/VehicleCard.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalGasStation, Person, MonetizationOn, CalendarToday, DriveEta, Description } from '@mui/icons-material'; // Import icons

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  marginBottom: 20,
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  background: 'linear-gradient(to bottom, rgb(224, 242, 254), rgb(56, 189, 248))',
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 50px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 220,
  borderRadius: '12px 12px 0 0',
  transition: 'transform 0.3s',
  marginTop: '20px',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'brightness(0.9)',
  },
}));

const BrandName = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#fff',
  backgroundColor: '#00796b',
  padding: '12px 0',
  borderRadius: '0 0 12px 12px',
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  lineHeight: '1.2',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  borderRadius: '20px',
  padding: '8px 16px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledUpdateButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: '#4caf50',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
}));

const StyledDeleteButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: '#f44336',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
}));

// New styled component for the detail with icons
const DetailTypography = styled(Typography)(({ theme }) => ({
  variant: 'body2',
  color: '#555',
  padding: '6px 0',
  display: 'flex', // Use flex to align icon and text
  alignItems: 'center', // Center the items vertically
  '& strong': {
    color: '#333',
  },
  '&:hover': {
    backgroundColor: '#e0f7fa',
    borderRadius: '4px',
  },
}));

const VehicleCard = ({ vehicle, onDelete, onUpdate }) => {
  return (
    <StyledCard>
      <CardActionArea>
        <BrandName>
          {vehicle.BrandName || 'Brand Name'}
        </BrandName>
        <StyledCardMedia
          component="img"
          image={vehicle.image || '/path/to/default_image.jpg'}
          alt={vehicle.VehicleName ? `${vehicle.VehicleName} image` : 'Vehicle image'}
        />
        <CardContent sx={{ paddingTop: 2 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ color: '#333', fontWeight: 'bold' }}>
            {vehicle.VehicleName || 'Vehicle Name'}
          </Typography>
          <DetailTypography>
            <CalendarToday style={{ color: '#00796b', marginRight: '8px' }} />
            <strong>Year:</strong> {vehicle.VehicleProductYear || 'N/A'}
          </DetailTypography>
          <DetailTypography>
            <MonetizationOn style={{ color: '#00796b', marginRight: '8px' }} />
            <strong>Rental Price Per Day:</strong> LKR {vehicle.rentalPrice || 'N/A'}
          </DetailTypography>
          <DetailTypography>
            <Person style={{ color: '#00796b', marginRight: '8px' }} />
            <strong>Capacity:</strong> {vehicle.Capacity || 'N/A'}
          </DetailTypography>
          <DetailTypography>
            <LocalGasStation style={{ color: '#00796b', marginRight: '8px' }} />
            <strong>Fuel Type:</strong> {vehicle.FuelType || 'N/A'}
          </DetailTypography>
          <DetailTypography>
            <Description style={{ color: '#00796b', marginRight: '8px' }} />
            <strong>Rental Terms:</strong> {vehicle.rentalTerms || 'N/A'}
          </DetailTypography>
          <DetailTypography>
            <DriveEta style={{ color: '#00796b', marginRight: '8px' }} />
            <strong>Transmission:</strong> {vehicle.Transmission || 'N/A'}
          </DetailTypography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <StyledUpdateButton size="small" onClick={() => onUpdate(vehicle)}>
          Update
        </StyledUpdateButton>
        <StyledDeleteButton size="small" onClick={() => onDelete(vehicle._id)}>
          Delete
        </StyledDeleteButton>
      </CardActions>
    </StyledCard>
  );
};

export default VehicleCard;
