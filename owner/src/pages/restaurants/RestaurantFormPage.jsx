import { useState, useEffect } from 'react';
import {
  Stack, Title, Group, Button, Card, Text, TextInput, Textarea, Select,
  MultiSelect, NumberInput, Switch, Divider, SimpleGrid, ActionIcon,
  Box, Grid, Paper, rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { TimeInput } from '@mantine/dates';
import { IconArrowLeft, IconUpload, IconPhoto, IconX, IconPlus, IconTrash } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { restaurantApi } from '../../api';

const CUISINES = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Continental', 'Mexican', 'Japanese', 'Thai', 'Mughlai', 'Bengali', 'Rajasthani', 'Gujarati', 'Kerala', 'Seafood', 'Biryani', 'Pizza', 'Burger', 'Fast Food', 'Cafe'];
const FACILITIES = ['AC', 'Parking', 'WiFi', 'Live Music', 'Rooftop', 'Outdoor Seating', 'Private Dining', 'Takeaway', 'Delivery', 'Bar', 'Hookah', 'Pet Friendly', 'Kids Zone'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const defaultHours = DAYS.reduce((acc, d) => {
  acc[d] = { isOpen: d !== 'sunday', openTime: '11:00', closeTime: '23:00' };
  return acc;
}, {});

export default function RestaurantFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!id;
  const [logoFile, setLogoFile] = useState(null);
  const [coverFiles, setCoverFiles] = useState([]);
  const [operatingHours, setOperatingHours] = useState(defaultHours);

  const form = useForm({
    initialValues: {
      name: '', description: '', cuisine: [], facilities: [],
      priceRange: 2, city: '', address: '', phone: '', email: '',
      website: '', minBookingGuests: 1, maxBookingGuests: 20,
      maxAdvanceBookingDays: 30, bookingDuration: 120,
      latitude: '', longitude: '',
    },
    validate: {
      name: (v) => (v.trim().length >= 2 ? null : 'Name must be at least 2 characters'),
      cuisine: (v) => (v.length > 0 ? null : 'Select at least one cuisine'),
      city: (v) => (v.trim() ? null : 'City is required'),
      phone: (v) => (/^\+?[0-9]{10,13}$/.test(v.replace(/\s/g, '')) ? null : 'Valid phone required'),
    },
  });

  const { data: existing } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantApi.getById(id).then((r) => r.data.data.restaurant),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!existing) return;
    form.setValues({
      name: existing.name || '',
      description: existing.description || '',
      cuisine: existing.cuisine || [],
      facilities: existing.amenities || [],
      priceRange: existing.priceRange || 2,
      city: existing.address?.city || '',
      address: existing.address?.street || '',
      phone: existing.contact?.phone || '',
      email: existing.contact?.email || '',
      website: existing.contact?.website || '',
      minBookingGuests: existing.bookingSettings?.minGuests || 1,
      maxBookingGuests: existing.bookingSettings?.maxGuestsPerBooking || 20,
      maxAdvanceBookingDays: existing.bookingSettings?.advanceBookingDays || 30,
      bookingDuration: 120,
      latitude: existing.location?.coordinates?.[1]?.toString() || '',
      longitude: existing.location?.coordinates?.[0]?.toString() || '',
    });
    if (existing.operatingHours?.length) {
      const hoursMap = existing.operatingHours.reduce((acc, h) => {
        acc[h.day] = { isOpen: h.isOpen, openTime: h.slots?.[0]?.open || '11:00', closeTime: h.slots?.[0]?.close || '23:00' };
        return acc;
      }, {});
      setOperatingHours((prev) => ({ ...prev, ...hoursMap }));
    }
  }, [existing]);

  const createMutation = useMutation({
    mutationFn: (fd) => restaurantApi.create(fd),
    onSuccess: () => {
      notifications.show({ title: 'Restaurant created!', color: 'green' });
      qc.invalidateQueries({ queryKey: ['my-restaurants'] });
      navigate('/restaurants');
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.response?.data?.message, color: 'red' }),
  });

  const updateMutation = useMutation({
    mutationFn: (fd) => restaurantApi.update(id, fd),
    onSuccess: () => {
      notifications.show({ title: 'Restaurant updated!', color: 'green' });
      qc.invalidateQueries({ queryKey: ['my-restaurants'] });
      navigate('/restaurants');
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.response?.data?.message, color: 'red' }),
  });

  const handleSubmit = (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((item) => fd.append(k, item));
      else fd.append(k, v);
    });
    fd.append('operatingHours', JSON.stringify(operatingHours));
    if (logoFile) fd.append('logo', logoFile);
    coverFiles.forEach((f) => fd.append('images', f));

    if (isEdit) updateMutation.mutate(fd);
    else createMutation.mutate(fd);
  };

  const toggleDay = (day) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const updateHour = (day, field, val) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: val },
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack gap="lg">
      <Group>
        <ActionIcon variant="subtle" onClick={() => navigate('/restaurants')}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Title order={2}>{isEdit ? 'Edit Restaurant' : 'Add New Restaurant'}</Title>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Basic Info */}
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb="md" tt="uppercase" size="sm" c="dimmed">Basic Information</Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Restaurant Name" placeholder="e.g. Spice Garden" required {...form.getInputProps('name')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <MultiSelect label="Cuisines" placeholder="Select cuisines" data={CUISINES} required searchable {...form.getInputProps('cuisine')} />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Description" placeholder="Tell customers about your restaurant..." rows={3} {...form.getInputProps('description')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select label="Price Range" data={[
                  { value: '1', label: '₹ Budget' },
                  { value: '2', label: '₹₹ Moderate' },
                  { value: '3', label: '₹₹₹ Fine Dining' },
                  { value: '4', label: '₹₹₹₹ Luxury' },
                ]} value={String(form.values.priceRange)} onChange={(v) => form.setFieldValue('priceRange', Number(v))} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="City" placeholder="Bangalore" required {...form.getInputProps('city')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Phone" placeholder="+91 98765 43210" required {...form.getInputProps('phone')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Address" placeholder="Street address" {...form.getInputProps('address')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Email" placeholder="restaurant@email.com" {...form.getInputProps('email')} />
              </Grid.Col>
              <Grid.Col span={12}>
                <MultiSelect label="Facilities" placeholder="Select facilities" data={FACILITIES} searchable {...form.getInputProps('facilities')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Latitude" placeholder="e.g. 12.9716 (for map location)" {...form.getInputProps('latitude')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Longitude" placeholder="e.g. 77.5946 (for map location)" {...form.getInputProps('longitude')} />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Images */}
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb="md" tt="uppercase" size="sm" c="dimmed">Images</Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size="sm" fw={600} mb={8}>Logo</Text>
                <Dropzone accept={IMAGE_MIME_TYPE} maxFiles={1} onDrop={(files) => setLogoFile(files[0])}
                  style={{ border: '2px dashed #dee2e6', borderRadius: 8, padding: 24, textAlign: 'center' }}>
                  <Stack align="center" gap={8}>
                    <IconPhoto size={28} color="#868e96" />
                    <Text size="sm" c="dimmed">Drop logo here</Text>
                    {logoFile && <Text size="xs" c="green">{logoFile.name}</Text>}
                  </Stack>
                </Dropzone>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Text size="sm" fw={600} mb={8}>Cover Images (up to 5)</Text>
                <Dropzone accept={IMAGE_MIME_TYPE} maxFiles={5}
                  onDrop={(files) => setCoverFiles((prev) => [...prev, ...files].slice(0, 5))}
                  style={{ border: '2px dashed #dee2e6', borderRadius: 8, padding: 24, textAlign: 'center' }}>
                  <Stack align="center" gap={8}>
                    <IconUpload size={28} color="#868e96" />
                    <Text size="sm" c="dimmed">Drop up to 5 cover photos</Text>
                  </Stack>
                </Dropzone>
                {coverFiles.length > 0 && (
                  <Group gap={6} mt={8} wrap="wrap">
                    {coverFiles.map((f, i) => (
                      <Paper key={i} p={6} withBorder radius="sm">
                        <Group gap={4}>
                          <Text size="xs">{f.name}</Text>
                          <ActionIcon size="xs" color="red" variant="subtle"
                            onClick={() => setCoverFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                            <IconX size={10} />
                          </ActionIcon>
                        </Group>
                      </Paper>
                    ))}
                  </Group>
                )}
              </Grid.Col>
            </Grid>
          </Card>

          {/* Operating Hours */}
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb="md" tt="uppercase" size="sm" c="dimmed">Operating Hours</Text>
            <Stack gap="sm">
              {DAYS.map((day) => (
                <Group key={day} gap="md">
                  <Switch checked={operatingHours[day]?.isOpen} onChange={() => toggleDay(day)} />
                  <Text size="sm" fw={600} style={{ width: 100, textTransform: 'capitalize' }}>{day}</Text>
                  {operatingHours[day]?.isOpen ? (
                    <>
                      <TimeInput
                        value={operatingHours[day]?.openTime}
                        onChange={(e) => updateHour(day, 'openTime', e.target.value)}
                        style={{ width: 100 }}
                      />
                      <Text size="sm" c="dimmed">to</Text>
                      <TimeInput
                        value={operatingHours[day]?.closeTime}
                        onChange={(e) => updateHour(day, 'closeTime', e.target.value)}
                        style={{ width: 100 }}
                      />
                    </>
                  ) : (
                    <Text size="sm" c="dimmed">Closed</Text>
                  )}
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Booking Settings */}
          <Card withBorder radius="md" p="lg">
            <Text fw={700} mb="md" tt="uppercase" size="sm" c="dimmed">Booking Settings</Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 3 }}>
                <NumberInput label="Min Guests" min={1} max={20} {...form.getInputProps('minBookingGuests')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <NumberInput label="Max Guests" min={1} max={100} {...form.getInputProps('maxBookingGuests')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <NumberInput label="Max Advance Days" min={1} max={365} {...form.getInputProps('maxAdvanceBookingDays')} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <NumberInput label="Slot Duration (mins)" min={30} max={240} step={30} {...form.getInputProps('bookingDuration')} />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Submit */}
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={() => navigate('/restaurants')}>Cancel</Button>
            <Button type="submit" color="brand" loading={isPending}>
              {isEdit ? 'Save Changes' : 'Create Restaurant'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
