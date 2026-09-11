export interface SubscriptionPackage {
  id: string;
  identifier: 'ishvara_monthly' | 'ishvara_yearly';
  title: string;
  description: string;
  priceString: string;
  period: 'month' | 'year';
  isRecommended?: boolean;
  savingsBadge?: string;
  features: string[];
}

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: 'pkg-yearly',
    identifier: 'ishvara_yearly',
    title: 'Annual Sadhana',
    description: 'Billed once per year. Cancel anytime.',
    priceString: '$49.99 / year',
    period: 'year',
    isRecommended: true,
    savingsBadge: 'Save 58% (Recommended)',
    features: [
      'Full Bhagavad Gita chapter-by-chapter wisdom path',
      'Unlimited high-fidelity spiritual reels & shlokas',
      'High-res audio downloads for offline meditation',
      'Advanced Ask Divya scripture-grounded AI mentor',
      'Exclusive Mahadev & Hanuman deep-dive series',
      'Zero ads, zero commercial clutter'
    ]
  },
  {
    id: 'pkg-monthly',
    identifier: 'ishvara_monthly',
    title: 'Monthly Seeker',
    description: 'Billed monthly. Pause or cancel anytime.',
    priceString: '$9.99 / month',
    period: 'month',
    features: [
      'Unlimited spiritual reels & shlokas',
      'Full devotional audio stream library',
      'Daily practice & streak progression',
      'Basic Ask Divya AI mentor queries',
      'Zero ads'
    ]
  }
];

class RevenueCatService {
  private isConfigured = false;
  private apiKey = process.env.REVENUECAT_PUBLIC_API_KEY || 'appl_simulated_live_revenuecat_key';

  public configure() {
    this.isConfigured = true;
    console.log('[RevenueCat] Initialized cross-platform entitlement manager');
  }

  public getPackages(): SubscriptionPackage[] {
    return SUBSCRIPTION_PACKAGES;
  }

  public async purchasePackage(packageId: 'ishvara_monthly' | 'ishvara_yearly'): Promise<{ success: boolean; activeEntitlement: string }> {
    // Simulates Purchases.purchasePackage in React Native / Expo
    await new Promise(res => setTimeout(res, 800));
    return {
      success: true,
      activeEntitlement: 'premium_wisdom'
    };
  }

  public async restorePurchases(): Promise<boolean> {
    await new Promise(res => setTimeout(res, 600));
    return true;
  }
}

export const revenueCat = new RevenueCatService();
