# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- Supabase project
- Stripe account (production keys)
- Printful account

## Environment Variables

Create a `.env` file with the following variables:

```env
# Backend
NODE_ENV=production
PORT=3000
JWT_SECRET=your-jwt-secret

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Printful
PRINTFUL_API_KEY=your-printful-api-key

# AI Service
OPENAI_API_KEY=sk-xxx
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. Build and start containers:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

2. Run database migrations:

```bash
./scripts/seed-db.sh
```

3. Check container status:

```bash
docker-compose -f docker/docker-compose.yml ps
```

### Option 2: Manual Deployment

#### Backend

1. Build the backend:

```bash
cd backend
npm install --production
npm run build
```

2. Start the server:

```bash
npm start
```

3. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start dist/index.js --name pod-ai-backend
pm2 save
```

#### Mobile App

1. Build for iOS:

```bash
cd mobile
eas build --platform ios
```

2. Build for Android:

```bash
eas build --platform android
```

3. Submit to stores:

```bash
eas submit --platform ios
eas submit --platform android
```

## Database Setup

1. Create a Supabase project at https://supabase.com

2. Run the schema:

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres < database/schema.sql
```

3. Apply RLS policies:

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres < database/rls-policies.sql
```

4. Create functions:

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres < database/functions.sql
```

## Nginx Configuration

The included `docker/nginx.conf` provides:

- SSL termination
- Rate limiting
- Static file serving
- API proxy
- WebSocket support

Update the domain name in the configuration:

```nginx
server_name your-domain.com;
```

## SSL Certificate

Using Let's Encrypt with Certbot:

```bash
certbot certonly --nginx -d your-domain.com -d api.your-domain.com
```

## Monitoring

### Logs

View backend logs:

```bash
docker-compose -f docker/docker-compose.yml logs -f backend
```

### Health Check

Check API health:

```bash
curl https://api.your-domain.com/health
```

## Scaling

### Horizontal Scaling

Run multiple backend instances behind a load balancer:

```bash
docker-compose -f docker/docker-compose.yml up -d --scale backend=3
```

### Database Optimization

- Enable connection pooling
- Set up read replicas for read-heavy operations
- Configure proper indexes (already in schema.sql)

## CI/CD with GitHub Actions

The project includes GitHub Actions workflows:

- `.github/workflows/backend-ci.yml` - Backend testing and deployment
- `.github/workflows/mobile-ci.yml` - Mobile app building and testing

Configure secrets in GitHub repository settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `STRIPE_SECRET_KEY`
- `PRINTFUL_API_KEY`
- `EXPO_TOKEN`

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups. For additional backups:

```bash
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### File Storage Backups

If using custom storage, implement regular backups:

```bash
aws s3 sync s3://your-bucket s3://your-backup-bucket
```

## Rollback Procedure

1. Stop current containers:

```bash
docker-compose -f docker/docker-compose.yml down
```

2. Pull previous image version:

```bash
docker pull your-registry/pod-ai-backend:previous-tag
```

3. Update docker-compose.yml with previous tag

4. Start containers:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] SSL certificates are properly configured
- [ ] Database uses strong passwords
- [ ] RLS policies are enabled
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] API keys are rotated regularly
- [ ] Monitoring and alerting are set up
- [ ] Backups are tested regularly

## Troubleshooting

### Backend won't start

Check logs:
```bash
docker-compose -f docker/docker-compose.yml logs backend
```

Common issues:
- Missing environment variables
- Database connection issues
- Port conflicts

### Mobile app build fails

- Ensure Expo CLI is up to date
- Check `app.json` configuration
- Verify all dependencies are installed

### Database connection issues

- Verify Supabase URL and keys
- Check network connectivity
- Ensure IP is whitelisted in Supabase

## Support

For issues and questions:
- Check the documentation in `docs/`
- Review API logs
- Contact the development team
