import { useEffect, useState } from 'react';
import {
  Stack, Title, Card, Text, NumberInput, Switch, Button, Grid,
  TextInput, Divider, Group, Skeleton, SegmentedControl, Alert,
  FileInput, Image,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy, IconUpload } from '@tabler/icons-react';
import { adminApi } from '../../api';


export default function SettingsPage() {
  const qc = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminApi.getSettings().then((r) => r.data.data.settings),
  });

  const platformForm = useForm({
    initialValues: {
      defaultCommission: 10,
      otpExpiry: 5,
      maxOtpAttempts: 5,
      accessTokenExpiry: '7d',
      maxRefreshDevices: 5,
      bookingCancellationHours: 2,
    },
  });

  const featureForm = useForm({
    initialValues: {
      enableWallet: true,
      enableGoogleLogin: true,
      enableRazorpay: true,
      enableSmsOtp: true,
      enableEmailVerification: true,
      maintenanceMode: false,
    },
  });

  const feeForm = useForm({
    initialValues: {
      convenienceFeeEnabled: true,
      convenienceFeeType: 'flat',
      convenienceFeeValue: 6,
      convenienceFeeCap: 25,
      convenienceFeeMinBill: 0,
      gstOnFeePercent: 18,
    },
  });

  const heroForm = useForm({
    initialValues: {
      homeHeroEnabled: false,
      homeHeroImageUrl: '',
      homeHeroVideoUrl: '',
    },
  });
  const [heroUploading, setHeroUploading] = useState(false);

  const uploadHeroImage = async (file) => {
    if (!file) return;
    setHeroUploading(true);
    try {
      const { data } = await adminApi.uploadAsset(file);
      heroForm.setFieldValue('homeHeroImageUrl', data.data.url);
      notifications.show({ title: 'Image uploaded', color: 'green' });
    } catch (err) {
      notifications.show({
        title: 'Upload failed',
        message: err.response?.data?.message || 'Use a JPG / PNG / WebP under 5 MB',
        color: 'red',
      });
    } finally {
      setHeroUploading(false);
    }
  };

  useEffect(() => {
    if (!settingsData) return;
    platformForm.setValues({
      defaultCommission: settingsData.defaultCommission ?? 10,
      otpExpiry: settingsData.otpExpiry ?? 5,
      maxOtpAttempts: settingsData.maxOtpAttempts ?? 5,
      accessTokenExpiry: settingsData.accessTokenExpiry ?? '7d',
      maxRefreshDevices: settingsData.maxRefreshDevices ?? 5,
      bookingCancellationHours: settingsData.bookingCancellationHours ?? 2,
    });
    featureForm.setValues({
      enableWallet: settingsData.enableWallet ?? true,
      enableGoogleLogin: settingsData.enableGoogleLogin ?? true,
      enableRazorpay: settingsData.enableRazorpay ?? true,
      enableSmsOtp: settingsData.enableSmsOtp ?? true,
      enableEmailVerification: settingsData.enableEmailVerification ?? true,
      maintenanceMode: settingsData.maintenanceMode ?? false,
    });
    feeForm.setValues({
      convenienceFeeEnabled: settingsData.convenienceFeeEnabled ?? true,
      convenienceFeeType: settingsData.convenienceFeeType ?? 'flat',
      convenienceFeeValue: settingsData.convenienceFeeValue ?? 6,
      convenienceFeeCap: settingsData.convenienceFeeCap ?? 25,
      convenienceFeeMinBill: settingsData.convenienceFeeMinBill ?? 0,
      gstOnFeePercent: settingsData.gstOnFeePercent ?? 18,
    });
    heroForm.setValues({
      homeHeroEnabled: settingsData.homeHeroEnabled ?? false,
      homeHeroImageUrl: settingsData.homeHeroImageUrl ?? '',
      homeHeroVideoUrl: settingsData.homeHeroVideoUrl ?? '',
    });
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: (data) => adminApi.updateSettings(data),
    onSuccess: () => {
      notifications.show({ title: 'Settings saved', color: 'green' });
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => notifications.show({ title: 'Failed to save', color: 'red' }),
  });

  if (isLoading) {
    return (
      <Stack gap="lg">
        <Title order={2}>Platform Settings</Title>
        <Skeleton height={400} radius="md" />
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Platform Settings</Title>

      <Grid gutter="md">
        {/* Platform Config */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb="lg" size="lg">General Configuration</Text>
            <form onSubmit={platformForm.onSubmit((v) => updateMutation.mutate(v))}>
              <Stack gap="md">
                <NumberInput
                  label="Default Commission (%)"
                  description="Applied to new restaurants"
                  min={0} max={50}
                  {...platformForm.getInputProps('defaultCommission')}
                />
                <NumberInput
                  label="OTP Expiry (minutes)"
                  min={1} max={30}
                  {...platformForm.getInputProps('otpExpiry')}
                />
                <NumberInput
                  label="Max OTP Attempts"
                  min={1} max={10}
                  {...platformForm.getInputProps('maxOtpAttempts')}
                />
                <TextInput
                  label="Access Token Expiry"
                  placeholder="7d, 24h, etc."
                  {...platformForm.getInputProps('accessTokenExpiry')}
                />
                <NumberInput
                  label="Max Devices per User"
                  description="Max refresh tokens stored"
                  min={1} max={20}
                  {...platformForm.getInputProps('maxRefreshDevices')}
                />
                <NumberInput
                  label="Cancellation Window (hours)"
                  description="Min hours before booking to allow cancellation"
                  min={0} max={72}
                  {...platformForm.getInputProps('bookingCancellationHours')}
                />
                <Button type="submit" color="gold" leftSection={<IconDeviceFloppy size={16} />}
                  loading={updateMutation.isPending}>
                  Save Settings
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid.Col>

        {/* Feature Toggles */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb="lg" size="lg">Feature Toggles</Text>
            <Stack gap="lg">
              {[
                { field: 'enableWallet', label: 'Wallet System', desc: 'Allow users to add money to wallet' },
                { field: 'enableGoogleLogin', label: 'Google Login', desc: 'OAuth via Google' },
                { field: 'enableRazorpay', label: 'Razorpay Payments', desc: 'Online payment processing' },
                { field: 'enableSmsOtp', label: 'SMS OTP (Twilio)', desc: 'Phone verification via SMS' },
                { field: 'enableEmailVerification', label: 'Email Verification', desc: 'Require email verification on signup' },
                { field: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Block all user access to app' },
              ].map(({ field, label, desc }) => (
                <Group key={field} justify="space-between">
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>{label}</Text>
                    <Text size="xs" c="dimmed">{desc}</Text>
                  </Stack>
                  <Switch
                    checked={featureForm.values[field]}
                    onChange={(e) => featureForm.setFieldValue(field, e.target.checked)}
                    color={field === 'maintenanceMode' ? 'red' : 'brand'}
                  />
                </Group>
              ))}
              <Divider />
              <Button color="gold" leftSection={<IconDeviceFloppy size={16} />}
                loading={updateMutation.isPending}
                onClick={() => updateMutation.mutate(featureForm.values)}>
                Save Feature Settings
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Pay Bill — Convenience Fee & GST */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb={4} size="lg">Pay Bill — Convenience Fee &amp; GST</Text>
            <Text size="xs" c="dimmed" mb="lg">
              Charged to the diner on top of (bill − discount). Platform revenue —
              it does not affect the restaurant&apos;s payout or commission.
            </Text>
            <form onSubmit={feeForm.onSubmit((v) => updateMutation.mutate(v))}>
              <Stack gap="md">
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>Charge a convenience fee</Text>
                    <Text size="xs" c="dimmed">Turn off to make Pay Bill fee-free</Text>
                  </Stack>
                  <Switch
                    checked={feeForm.values.convenienceFeeEnabled}
                    onChange={(e) => feeForm.setFieldValue('convenienceFeeEnabled', e.target.checked)}
                    color="brand"
                  />
                </Group>

                <div>
                  <Text size="sm" fw={500} mb={6}>Fee type</Text>
                  <SegmentedControl
                    fullWidth
                    data={[{ label: 'Flat ₹', value: 'flat' }, { label: 'Percent %', value: 'percent' }]}
                    value={feeForm.values.convenienceFeeType}
                    onChange={(v) => feeForm.setFieldValue('convenienceFeeType', v)}
                    disabled={!feeForm.values.convenienceFeeEnabled}
                  />
                </div>

                <NumberInput
                  label={feeForm.values.convenienceFeeType === 'percent' ? 'Fee (% of bill after discount)' : 'Fee amount (₹)'}
                  min={0}
                  max={feeForm.values.convenienceFeeType === 'percent' ? 30 : 500}
                  decimalScale={2}
                  disabled={!feeForm.values.convenienceFeeEnabled}
                  {...feeForm.getInputProps('convenienceFeeValue')}
                />

                {feeForm.values.convenienceFeeType === 'percent' && (
                  <NumberInput
                    label="Fee cap (₹)"
                    description="Max fee when using a percentage · 0 = no cap"
                    min={0} max={1000}
                    disabled={!feeForm.values.convenienceFeeEnabled}
                    {...feeForm.getInputProps('convenienceFeeCap')}
                  />
                )}

                <NumberInput
                  label="Waive fee below bill (₹)"
                  description="Bills under this pay no convenience fee · 0 = always charge"
                  min={0} max={5000}
                  disabled={!feeForm.values.convenienceFeeEnabled}
                  {...feeForm.getInputProps('convenienceFeeMinBill')}
                />

                <NumberInput
                  label="GST on the convenience fee (%)"
                  description="Tax added on the fee itself (India: 18)"
                  min={0} max={28}
                  {...feeForm.getInputProps('gstOnFeePercent')}
                />

                <Alert color="blue" variant="light" p="sm">
                  <Text size="xs">
                    Example on a ₹1,000 bill, 15% off →{' '}
                    <b>
                      ₹{(() => {
                        const base = 850;
                        const f = feeForm.values.convenienceFeeEnabled && base >= (feeForm.values.convenienceFeeMinBill || 0)
                          ? (feeForm.values.convenienceFeeType === 'percent'
                            ? Math.min(base * (feeForm.values.convenienceFeeValue || 0) / 100, feeForm.values.convenienceFeeCap || Infinity)
                            : (feeForm.values.convenienceFeeValue || 0))
                          : 0;
                        const g = f * (feeForm.values.gstOnFeePercent || 0) / 100;
                        return (base + f + g).toFixed(2);
                      })()}
                    </b>{' '}
                    to pay (fee + GST included)
                  </Text>
                </Alert>

                <Button type="submit" color="gold" leftSection={<IconDeviceFloppy size={16} />}
                  loading={updateMutation.isPending}>
                  Save Fee Settings
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid.Col>

        {/* Mobile Home — hero background (Swiggy-style) */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb={4} size="lg">Mobile Home — Background</Text>
            <Text size="xs" c="dimmed" mb="lg">
              Shows behind the location bar, greeting and search on the app home
              screen, under a dark overlay so text stays readable.
            </Text>
            <form onSubmit={heroForm.onSubmit((v) => updateMutation.mutate(v))}>
              <Stack gap="md">
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>Use a background image</Text>
                    <Text size="xs" c="dimmed">Off = plain logo-blue background</Text>
                  </Stack>
                  <Switch
                    checked={heroForm.values.homeHeroEnabled}
                    onChange={(e) => heroForm.setFieldValue('homeHeroEnabled', e.target.checked)}
                    color="brand"
                  />
                </Group>

                <FileInput
                  label="Background image"
                  description="Wide / landscape works best · JPG, PNG or WebP, under 5 MB"
                  placeholder="Upload an image"
                  accept="image/png,image/jpeg,image/webp"
                  leftSection={<IconUpload size={16} />}
                  disabled={heroUploading}
                  onChange={uploadHeroImage}
                />

                {heroForm.values.homeHeroImageUrl ? (
                  <Image
                    src={heroForm.values.homeHeroImageUrl}
                    radius="md"
                    h={130}
                    fit="cover"
                    alt="Home background preview"
                  />
                ) : null}

                <TextInput
                  label="…or paste an image URL"
                  placeholder="https://…"
                  {...heroForm.getInputProps('homeHeroImageUrl')}
                />

                <TextInput
                  label="Looping video URL (optional)"
                  description="An .mp4 plays instead of the image when set"
                  placeholder="https://…/hero.mp4"
                  {...heroForm.getInputProps('homeHeroVideoUrl')}
                />

                <Button type="submit" color="gold" leftSection={<IconDeviceFloppy size={16} />}
                  loading={updateMutation.isPending || heroUploading}>
                  Save Background
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
