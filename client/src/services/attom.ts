// This is a mock service for the ATTOM API.
// In a real implementation with a backend, this would call your server's proxy endpoint.

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
}

// Mock data to simulate API response
const MOCK_PROPERTIES: Record<string, AttomPropertyData> = {
  "123 Main St": {
    address: {
      line1: "123 Main St",
      line2: "",
      locality: "Austin",
      countrySubd: "TX",
      postal1: "78701"
    },
    summary: {
      yearBuilt: 2015,
      propLandUse: "SFR",
      propClass: "Residential"
    },
    building: {
      size: {
        bldgSize: 2400,
        grossSize: 2400
      },
      rooms: {
        beds: 4,
        bathsTotal: 3
      }
    },
    assessment: {
      assessed: {
        assdTotalValue: 450000
      },
      market: {
        mktTotalValue: 525000
      }
    }
  }
};

export async function searchProperty(address: string): Promise<AttomPropertyData | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real app, this would be:
  // const res = await fetch(`/api/property?address=${encodeURIComponent(address)}`);
  // return res.json();

  // For prototype, return mock data or generate random data
  const mock = MOCK_PROPERTIES["123 Main St"];
  
  // Return variations based on input to make it feel "real"
  return {
    ...mock,
    address: {
      ...mock.address,
      line1: address
    },
    assessment: {
      ...mock.assessment,
      market: {
        mktTotalValue: 300000 + Math.floor(Math.random() * 500000)
      }
    }
  };
}
