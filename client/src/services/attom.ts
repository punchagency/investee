export interface AttomPropertyData {
  address: {
    line1: string;
    line2: string;
    locality: string;
    countrySubd: string;
    postal1: string;
  };
  summary: {
    yearBuilt: number;
    propLandUse: string;
    propClass: string;
  };
  building: {
    size: {
      bldgSize: number;
      grossSize: number;
    };
    rooms: {
      beds: number;
      bathsTotal: number;
    };
  };
  assessment: {
    assessed: {
      assdTotalValue: number;
    };
    market: {
      mktTotalValue: number;
    };
  };
  lot?: {
    lotSize1?: number;
    lotSize2?: number;
  };
  sale?: {
    amount?: {
      saleamt: number;
    };
    saleTransDate?: string;
  };
}

export interface AttomApiResponse {
  status: {
    version: string;
    code: number;
    msg: string;
    total: number;
    page: number;
    pagesize: number;
  };
  property: Array<{
    identifier: {
      obPropId: number;
      fips: string;
      apn: string;
      attomId: number;
    };
    address: {
      country: string;
      line1: string;
      line2?: string;
      locality: string;
      countrySubd: string;
      postal1: string;
      postal2?: string;
    };
    summary?: {
      yearBuilt?: number;
      propLandUse?: string;
      propClass?: string;
      propSubType?: string;
      propType?: string;
    };
    building?: {
      size?: {
        bldgSize?: number;
        grossSize?: number;
        livingSize?: number;
      };
      rooms?: {
        beds?: number;
        bathsTotal?: number;
        bathsFull?: number;
        bathsHalf?: number;
      };
      interior?: {
        fplcCount?: number;
      };
    };
    lot?: {
      lotSize1?: number;
      lotSize2?: number;
    };
    assessment?: {
      assessed?: {
        assdTotalValue?: number;
        assdLandValue?: number;
        assdImprValue?: number;
      };
      market?: {
        mktTotalValue?: number;
        mktLandValue?: number;
        mktImprValue?: number;
      };
      tax?: {
        taxAmt?: number;
        taxYear?: number;
      };
    };
    sale?: {
      amount?: {
        saleamt?: number;
      };
      saleTransDate?: string;
    };
  }>;
}

export async function searchProperty(address: string): Promise<AttomPropertyData | null> {
  try {
    const response = await fetch(`/api/property/search?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch property data");
    }

    const data: AttomApiResponse = await response.json();
    
    if (!data.property || data.property.length === 0) {
      return null;
    }

    const prop = data.property[0];
    
    return {
      address: {
        line1: prop.address.line1 || "",
        line2: prop.address.line2 || "",
        locality: prop.address.locality || "",
        countrySubd: prop.address.countrySubd || "",
        postal1: prop.address.postal1 || "",
      },
      summary: {
        yearBuilt: prop.summary?.yearBuilt || 0,
        propLandUse: prop.summary?.propLandUse || "",
        propClass: prop.summary?.propClass || "Residential",
      },
      building: {
        size: {
          bldgSize: prop.building?.size?.bldgSize || 0,
          grossSize: prop.building?.size?.grossSize || 0,
        },
        rooms: {
          beds: prop.building?.rooms?.beds || 0,
          bathsTotal: prop.building?.rooms?.bathsTotal || 0,
        },
      },
      assessment: {
        assessed: {
          assdTotalValue: prop.assessment?.assessed?.assdTotalValue || 0,
        },
        market: {
          mktTotalValue: prop.assessment?.market?.mktTotalValue || 0,
        },
      },
      lot: {
        lotSize1: prop.lot?.lotSize1,
        lotSize2: prop.lot?.lotSize2,
      },
      sale: prop.sale ? {
        amount: prop.sale.amount,
        saleTransDate: prop.sale.saleTransDate,
      } : undefined,
    };
  } catch (error) {
    console.error("Error searching property:", error);
    throw error;
  }
}

export async function searchPropertiesByRadius(
  lat: number,
  lng: number,
  radius: number = 1,
  filters?: {
    minbeds?: number;
    maxbeds?: number;
    propertytype?: string;
  }
): Promise<AttomPropertyData[]> {
  try {
    let url = `/api/property/radius?lat=${lat}&lng=${lng}&radius=${radius}`;
    if (filters?.minbeds) url += `&minbeds=${filters.minbeds}`;
    if (filters?.maxbeds) url += `&maxbeds=${filters.maxbeds}`;
    if (filters?.propertytype) url += `&propertytype=${filters.propertytype}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const data: AttomApiResponse = await response.json();
    
    if (!data.property || data.property.length === 0) {
      return [];
    }

    return data.property.map(prop => ({
      address: {
        line1: prop.address.line1 || "",
        line2: prop.address.line2 || "",
        locality: prop.address.locality || "",
        countrySubd: prop.address.countrySubd || "",
        postal1: prop.address.postal1 || "",
      },
      summary: {
        yearBuilt: prop.summary?.yearBuilt || 0,
        propLandUse: prop.summary?.propLandUse || "",
        propClass: prop.summary?.propClass || "Residential",
      },
      building: {
        size: {
          bldgSize: prop.building?.size?.bldgSize || 0,
          grossSize: prop.building?.size?.grossSize || 0,
        },
        rooms: {
          beds: prop.building?.rooms?.beds || 0,
          bathsTotal: prop.building?.rooms?.bathsTotal || 0,
        },
      },
      assessment: {
        assessed: {
          assdTotalValue: prop.assessment?.assessed?.assdTotalValue || 0,
        },
        market: {
          mktTotalValue: prop.assessment?.market?.mktTotalValue || 0,
        },
      },
      lot: {
        lotSize1: prop.lot?.lotSize1,
        lotSize2: prop.lot?.lotSize2,
      },
      sale: prop.sale ? {
        amount: prop.sale.amount,
        saleTransDate: prop.sale.saleTransDate,
      } : undefined,
    }));
  } catch (error) {
    console.error("Error searching properties by radius:", error);
    throw error;
  }
}
