import { useState, useEffect } from 'react';
import {
  Stack, Title, Card, Text, NumberInput, Switch, Button, Grid,
  TextInput, Divider, Group, Skeleton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons-react';
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
      </Grid>
    </Stack>
  );
}
