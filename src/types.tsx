import React from "react";

 export interface PlaceAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  }
  
export interface AddressSelectionProps {
  onAddressSelected: (address: PlaceAddress, price: number) => void;
  onValidAddress: (validAddress: boolean) => void;
}
  